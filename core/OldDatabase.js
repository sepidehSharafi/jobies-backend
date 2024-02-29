// const postgres = require('postgres');

// PGHOST = 'ep-withered-river-a5w050ze.us-east-2.aws.neon.tech'
// PGDATABASE = 'finalProject'
// PGUSER = 'lay.lover2020'
// PGPASSWORD = 'YD4jXoiw2phv'
// ENDPOINT_ID = 'ep-withered-river-a5w050ze'
// const sql = postgres({
//     host: PGHOST,
//     database: PGDATABASE,
//     username: PGUSER,
//     password: PGPASSWORD,
//     port: 5432,
//     ssl: 'require',
//     connection: {
//         options: `project=${ENDPOINT_ID}`,
//     },
// });

// module.exports = { sql };

const postgres = require('postgres');

PGHOST = 'ep-withered-river-a5w050ze.us-east-2.aws.neon.tech'
PGDATABASE = 'finalProject'
PGUSER = 'lay.lover2020'
PGPASSWORD = 'YD4jXoiw2phv'
ENDPOINT_ID = 'ep-withered-river-a5w050ze'
const sql = postgres({
    host: PGHOST,
    database: PGDATABASE,
    username: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: 'require',
    connection: {
        options: `project=${ENDPOINT_ID}`,
    },
});

const query = async (queryString) => {
    try {
        const result = await sql.query(queryString);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error('Error executing SQL query');
    }
};

module.exports = { sql, query };
