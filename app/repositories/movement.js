const server = require('../../server')

module.exports.create = async function(attributes, quantityAttributes, movement) {
    try {
        const client = await server.connect()
        await client.query(`INSERT INTO movement(${attributes}) VALUES (${quantityAttributes})`, movement)
    } catch(error) {
        throw new Error(error.message)
    }
}

module.exports.delete = async function(code) {
    try {
        const client = await server.connect()
        await client.query(`DELETE FROM movement where code=\$1`, [code])
    } catch(error) {
        throw new Error(error.message)
    }
}

module.exports.filter = async function(exprFilter, exprSort) {
    try {
        const client = await server.connect()
        const containers = await client.query(`SELECT * FROM movement ${exprFilter} ${exprSort}`)
        return containers.rows
    } catch(error) {
        throw new Error(error.message)
    }
}

module.exports.update = async function(exprFilter, exprValuesUpdate) {
    try {
        const client = await server.connect()
        await client.query(`UPDATE movement SET ${exprValuesUpdate} WHERE ${exprFilter}`)
    } catch(error) {
        throw new Error(error.message)
    }
}

module.exports.count = async function() {
    try {
        const client = await server.connect()
        const count = await client.query(`SELECT count(1) FROM movement`)
        return count.rows
    } catch(error) {
        throw new Error(error.message)
    }
}

module.exports.getContainersInMovements = async function(limit = 5, offset) {
    try {
        const client = await server.connect()
        const movements = await client.query(`SELECT movement.type, movement.start_date, movement.end_date, movement.container, container.client, container.category
                                              FROM movement
                                              INNER JOIN container
                                              ON movement.container = container.identification_number
                                              LIMIT ${limit}
                                              OFFSET ${offset}`)
        return movements.rows
    } catch(error) {
        throw new Error(error.message)
    }
}