const server = require('../../server')

module.exports.create = async function(attributes, container) {
    try {
        const client = await server.connect()
        await client.query(`INSERT INTO container(${attributes}) VALUES (\$1, \$2, \$3, \$4, \$5)`, container)
    } catch(error) {
        throw new Error(error.message)
    }
}

module.exports.delete = async function(identificationNumber) {
    try {
        const client = await server.connect()
        await client.query(`DELETE FROM container WHERE identification_number=\$1`, [identificationNumber])
    } catch(error) {
        throw new Error(error.message)
    }
}

module.exports.filter = async function(exprFilter, exprSort) {
    try {
        const client = await server.connect()
        const containers = await client.query(`SELECT * FROM container ${exprFilter} ${exprSort}`)
        return containers.rows
    } catch(error) {
        throw new Error(error.message)
    }
}

module.exports.update = async function(exprFilter, exprValuesUpdate) {
    try {
        const client = await server.connect()
        await client.query(`UPDATE container SET ${exprValuesUpdate} WHERE ${exprFilter}`)
    } catch(error) {
        throw new Error(error.message)
    }
}