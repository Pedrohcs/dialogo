const movementRepository = require('../repositories/movement')
const containerController = require('./container')

const TYPE_MOVEMENTS_ENUM = ['embarque', 'descarga', 'gate in', 'gate out', 'reposicionamento', 'pesagem', 'scanner']

module.exports.createMovement = async function(newMovement) {
    try {
        validateMovement(newMovement)

        let { attributes, quantityAttributes, movementValues } = formatedMovementValues(newMovement)
        await movementRepository.create(attributes, quantityAttributes, movementValues)
    } catch(error) {
        console.error(`[createMovement] Error creating Movement. ${error.message}`)
        throw error
    }
}

function validateMovement(newMovement) {
    if (!newMovement || !newMovement.type)
        throw { code: 400, message: 'It is mandatory to inform the type of movement'}
    if (!validateType(newMovement.type))
        throw { code: 400, message: `The type entered is not correct. The correct format is: ${TYPE_MOVEMENTS_ENUM}`}
    if (!newMovement.startDate)
        throw { code: 400, message: 'It is mandatory to inform the start date of the movement'}

    newMovement.startDate = new Date(newMovement.startDate)
    if (newMovement.endDate) {
        newMovement.endDate = new Date(newMovement.endDate)
        if (newMovement.endDate < newMovement.startDate)
            throw { code: 400, message: 'The end date cannot be greater than the start date.'}
    }

    if (!newMovement.container)
        throw { code: 400, message: 'It is mandatory to inform the container of the movement'}
    if (!containerController.validateIdentificationNumber(newMovement.container))
        throw { code: 400, message: 'The identification number format is incorrect. The correct format is: 4 letters and 7 numbers. Ex: TEST1234567'}
}

function validateType(type) {
    return TYPE_MOVEMENTS_ENUM.includes(type)
}

function formatedMovementValues(newMovement) {
    let attributes = ''
    let quantityAttributes = ''
    let movementValues = []
    let index = 1

    newMovement['start_date'] = newMovement.startDate
    delete newMovement.startDate

    if (newMovement.endDate) {
        newMovement['end_date'] = newMovement.endDate
        delete newMovement.endDate
    }

    for (let key in newMovement) {
        if (!attributes)
            attributes += `${key}`
        else
            attributes += `, ${key}`

        movementValues.push(newMovement[key])

        if (!quantityAttributes)
            quantityAttributes += `\$${index}`
        else
            quantityAttributes += `, \$${index}`
        index ++
    }

    return {
        attributes: attributes,
        quantityAttributes: quantityAttributes,
        movementValues: movementValues
    }
}

module.exports.deleteMovement = async function(code) {
    try {
        if (!code)
            throw { code: 400, message: 'It is mandatory to inform the code of the movement'}

        await movementRepository.delete(code)
    } catch(error) {
        console.error(`[deleteMovement] Error deleting movement ${code}. ${error.message}`)
        throw error
    }
}

module.exports.getMovements = async function(filter, sort) {
    try {
        let exprFilter = ''
        let exprSort = ''

        if (filter.startDate) {
            filter['start_date'] = filter.startDate
            delete filter.startDate
        }
        if (sort.startDate) {
            sort['start_date'] = sort.startDate
            delete sort.startDate
        }
        if (filter.endDate) {
            filter['end_date'] = filter.endDate
            delete filter.endDate
        }
        if (sort.endDate) {
            sort['end_date'] = sort.endDate
            delete sort.endDate
        }

        for (let key in filter) {
            switch (key) {
                case 'start_date':
                    if (!exprFilter)
                        exprFilter += `WHERE ${key} >= '${filter[key]}'`
                    else
                        exprFilter += ` AND ${key} >= '${filter[key]}'`
                    break
                case 'end_date':
                    if (!exprFilter)
                        exprFilter += `WHERE ${key} <= '${filter[key]}'`
                    else
                        exprFilter += ` AND ${key} <= '${filter[key]}'`
                    break
                default:
                    if (!exprFilter)
                        exprFilter += `WHERE ${key} = '${filter[key]}'`
                    else
                        exprFilter += ` AND ${key} = '${filter[key]}'`
            }
        }

        for (let key in sort) {
            if (!exprSort)
                exprSort += `ORDER BY ${key} ${sort[key] == -1 ? 'DESC': ''}`
            else
                exprSort += `, ${key} ${sort[key] == -1 ? 'DESC': ''}`
        }
        let movements = await movementRepository.filter(exprFilter, exprSort)
        return movements
    } catch(error) {
        console.error(`[getMovements] Error filtering movements. ${error.message}`)
        throw error
    }
}

module.exports.updateMovement = async function(filter, update) {
    try {
        let exprFilter = ''
        let exprValuesUpdate = ''

        if (!filter || Object.keys(filter).length === 0)
            throw { code: 400, message: 'To perform the update it is mandatory to pass some type of filter'}

        if (!update || Object.keys(update).length === 0)
            throw { code: 400, message: 'To perform the update it is mandatory to pass some value to be updated'}

        validateUpdate(update)

        if (filter.startDate) {
            filter['start_date'] = filter.startDate
            delete filter.startDate
        }
        if (filter.endDate) {
            filter['end_date'] = filter.endDate
            delete filter.endDate
        }

        if (update.startDate) {
            update['start_date'] = update.startDate
            delete update.startDate
        }
        if (update.endDate) {
            update['end_date'] = update.endDate
            delete update.endDate
        }

        for (let key in filter) {
            if (!exprFilter)
                exprFilter += `${key} = '${filter[key]}'`
            else
                exprFilter += ` AND ${key} = '${filter[key]}'`
        }

        for (let key in update) {
            if (!exprValuesUpdate)
                exprValuesUpdate += `${key} = '${update[key]}'`
            else
                exprValuesUpdate += `, ${key} = '${update[key]}'`
        }

        await movementRepository.update(exprFilter, exprValuesUpdate)
    } catch(error) {
        console.error(`[updateMovement] Error performing update. ${error.message}`)
        throw error
    }
}

function validateUpdate(update) {
    if (update.code)
        throw { code: 403, message: 'It is not allowed to update the movement code'}
    if (update.container)
        throw { code: 403, message: 'It is not allowed to update the movement container'}

    if (update.type && !validateType(update.type))
        throw { code: 400, message: `The type entered is not correct. The correct format is: ${TYPE_MOVEMENTS_ENUM}`}
}