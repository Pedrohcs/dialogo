const app = require('./app/app')
const http = require('http')
const debug = require('debug')('nodestr:server')
const { Pool } = require('pg')

async function connect() {
    if (global.connection)
        return global.connection.connect()

    const pool = new Pool({
        connectionString: 'postgres://postgres:123@localhost:5432/dialogo'
    })

    const client = await pool.connect()
    console.log(`Created connection pool in PostgresSQL`)

    const res = await client.query('SELECT NOW()')
    console.log(res.rows[0])

    client.release()

    global.connection = pool
    return pool.connect()
}
module.exports.connect = connect

function normalizePort(value) {
    const port = parseInt(value, 10)

    if (isNaN(port))
        return value

    if (port >= 0)
        return port

    return false
}

function onErro(error) {
    if (error.syscall !== 'listen')
        throw error

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`)
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(`${bind} is already is use`)
            process.exit(1)
            break
        default:
            throw error
    }
}

function onListening() {
    const addr = server.address()
    const bind = typeof addr === 'string' ? 'Pipe ' + port : 'Port ' + port
    debug(`Listening on ${bind}`)
}

const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

const server = http.createServer(app)

server.listen(port)
server.on('error', onErro)
server.on('listening', onListening)
console.log(`Server running on port ${port}`)