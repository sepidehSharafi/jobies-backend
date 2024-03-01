
const { Postgres } = require('./handler');
const database = require('./secrets');

const db = new Postgres(
    database.host,
    database.database,
    database.user,
    database.password,
    database.port,
    database.ssl
)

module.exports = { db };