const containerRepository = require('../repositories/container')

module.exports.createContainer = async function(newContainer) {
    try {
        validateContainer(newContainer)

        let { attributes, contaiverValues } = formatedContainerValues(newContainer)
        await containerRepository.create(attributes, contaiverValues)
    } catch(error) {
        console.error(`[createContainer] Error creating Container ${newContainer.identificationNumber}. ${error.message}`)
        throw error
    }
}

function validateContainer(newContainer) {
    if (!newContainer || !newContainer.client)
        throw { code: 400, message: 'It is mandatory to inform the client of the container'}

    if (!newContainer.identificationNumber)
        throw { code: 400, message: 'It is mandatory to inform the identification number of the container'}

    if (!validateIdentificationNumber(newContainer.identificationNumber))
        throw { code: 400, message: 'The identification number format is incorrect. The correct format is: 4 letters and 7 numbers. Ex: TEST1234567'}

    if (!newContainer.type)
        throw { code: 400, message: 'It is mandatory to inform the type of container'}

    if (!validateType(newContainer.type))
        throw { code: 400, message: 'The type format is incorrect. The correct format is: \'20\' or \'40\''}

    if (!newContainer.status)
        throw { code: 400, message: 'It is mandatory to inform the status of the container'}

    if (!validateStatus(newContainer.status))
        throw { code: 400, message: 'The status format is incorrect. The correct format is: \'Cheio\' or \'Vazio\''}

    if (!newContainer.category)
        throw { code: 400, message: 'It is mandatory to inform the category of the container'}

    if (!validateCategory(newContainer.category))
        throw { code: 400, message: 'The category format is incorrect. The correct format is: \'Importacao\' or \'Exportacao\''}
}

function validateIdentificationNumber(identificationNumber) {
    const re = new RegExp(/[A-Z]{4}[0-9]{7}/)
    return identificationNumber.match(re)
}
module.exports.validateIdentificationNumber = validateIdentificationNumber

function validateType(type) {
    return type === '20' || type === '40'
}

function validateStatus(status) {
    return status === 'Cheio' || status === 'Vazio'
}

function validateCategory(category) {
    return category === 'Importacao' || category === 'Exportacao'
}

function formatedContainerValues(newContainer) {
    let attributes = ''
    let contaiverValues = []

    newContainer['identification_number'] = newContainer.identificationNumber
    delete newContainer.identificationNumber

    for (let key in newContainer) {
        if (!attributes)
            attributes += `${key}`
        else
            attributes += `, ${key}`

        contaiverValues.push(newContainer[key])
    }

    return {
        attributes: attributes,
        contaiverValues: contaiverValues
    }
}

module.exports.deleteContainer = async function(identificationNumber) {
    try {
        if (!identificationNumber)
            throw { code: 400, message: 'It is mandatory to inform the identification code of the container'}

        if (!validateIdentificationNumber(identificationNumber))
            throw { code: 400, message: 'The identification number format is incorrect. The correct format is: 4 letters and 7 numbers. Ex: TEST1234567'}

        await containerRepository.delete(identificationNumber)
    } catch(error) {
        console.error(`[deleteContainer] Error deleting Container ${identificationNumber}. ${error.message}`)
        throw error
    }
}

module.exports.getContainers = async function(filter, sort) {
    try {
        let exprFilter = ''
        let exprSort = ''

        if (filter.identificationNumber) {
            filter['identification_number'] = filter.identificationNumber
            delete filter.identificationNumber
        }

        if (sort.identificationNumber) {
            sort['identification_number'] = sort.identificationNumber
            delete sort.identificationNumber
        }

        for (let key in filter) {
            if (!exprFilter)
                exprFilter += `WHERE ${key} = '${filter[key]}'`
            else
                exprFilter += ` AND ${key} = '${filter[key]}'`
        }

        for (let key in sort) {
            if (!exprSort)
                exprSort += `ORDER BY ${key} ${sort[key] === -1 ? 'DESC' : ''}`
            else
                exprSort += `, ${key} ${sort[key] === -1 ? 'DESC' : ''}`
        }

        let containers = await containerRepository.filter(exprFilter, exprSort)
        return containers
    } catch(error) {
        console.error(`[getContainers] Error filtering Containers. ${error.message}`)
        throw error
    }
}

module.exports.updateContainer = async function(filter, update) {
    try {
        let exprFilter = ''
        let exprValuesUpdate = ''

        if (!filter || Object.keys(filter).length === 0)
            throw { code: 400, message: 'To perform the update it is mandatory to pass some type of filter'}

        if (!update || Object.keys(update).length === 0)
            throw { code: 400, message: 'To perform the update it is mandatory to pass some value to be updated'}

        validateUpdate(update)

        if (filter.identificationNumber) {
            filter['identification_number'] = filter.identificationNumber
            delete filter.identificationNumber
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
        await containerRepository.update(exprFilter, exprValuesUpdate)
    } catch(error) {
        console.error(`[updateContainer] Error performing update Container. ${error.message}`)
        throw error
    }
}

function validateUpdate(update) {
    if (update.client)
        throw { code: 403, message: 'It is not allowed to update the container client'}
    if (update.identificationNumber)
        throw { code: 403, message: 'It is not allowed to update the container identification number'}

    if (update.type && !validateType(update.type))
        throw { code: 400, message: 'The type format is incorrect. The correct format is: \'20\' or \'40\''}
    if (update.status && !validateStatus(update.status))
        throw { code: 400, message: 'The status format is incorrect. The correct format is: \'Cheio\' or \'Vazio\''}
    if (update.category && !validateCategory(update.category))
        throw { code: 400, message: 'The category format is incorrect. The correct format is: \'Importacao\' or \'Exportacao\''}
}