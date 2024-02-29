const {Pool} = require('pg');
class Postgres {
    constructor(user, password, host, port, database, ssl) {
        const options = {
            host,
            database,
            user,
            password,
            port,
            query_timeout: 60000,
            ssl
        };
        this.pool = new Pool(options);
        this.pool.on('connect', () => {
            console.log('Database pool connected successfully');
        });
        this.pool.on('error', (error) => {
            console.log('Database pool error');
            console.log(error);
        });
    }

    async query(sql, values) {
        try {
            const response = await this.pool.query(sql, values);
            return response;
        } catch (e) {
            console.log('QUERY ERROR => ', e);
            throw new Error(e);
        }
    }
}

module.exports = {
    Postgres
};