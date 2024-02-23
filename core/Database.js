// app.js
const postgres = require('postgres');
PGHOST='ep-withered-river-a5w050ze.us-east-2.aws.neon.tech'
PGDATABASE='finalProject'
PGUSER='lay.lover2020'
PGPASSWORD='YD4jXoiw2phv'
ENDPOINT_ID='ep-withered-river-a5w050ze'
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
