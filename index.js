const express = require('express');
const { request } = require('http');
const { sql } = require('./core/Database');

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

app.get('/users', (req, res) => {
    sql`SELECT * FROM users`.then((result) => {
        res.send(result)
    })
});
app.get('/posts', (req, res) => {
    sql`SELECT * FROM posts`.then((result) => {
        res.send(result)
    })
});

app.post('/login', async (request, response) => {
        const { username, password } = request.body
        const findUser = await sql`SELECT * FROM users WHERE username = ${username} AND password = ${password};`;

        if (findUser && findUser.length > 0) {
            response.send(findUser);
        }
        response.send({ error: true, message: 'wrong input information!' });
});

app.listen(port, () => console.log(` My App listening at http://localhost:${port}`));