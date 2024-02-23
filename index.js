const express = require('express');
const { request } = require('http');
const postgres = require('postgres');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const port = 3000;
// app.js
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

app.get('/users', (req, res) => {
    sql`SELECT * FROM users`.then((result)=> {
        res.send(result)
    })
});
app.get('/posts', (req, res) => {
    sql`SELECT * FROM posts`.then((result)=> {
        res.send(result)
    })
});

// app.post{
//     '/login', async (request, response) => {
//         const { username, password } = request.body
//         const findUser = await sql`SELECT * FROM users WHERE username = ${username} AND password = ${password};`;

//         if (findUser && findUser.length > 0) {
//             response.send(findUser)
//         }
//         response.send({ error: true, message: 'wrong input information!' })
//     }
// };

app.listen(port, () => console.log(` My App listening at http://localhost:${port}`));