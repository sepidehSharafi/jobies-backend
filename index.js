const express = require('express');
const { db } = require('./core/Database/index');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const port = 3000;

app.get('/users', async (_, response) => {
    const users = await db`select * from users`;
    response.send(users);
}); 

app.get('/posts', (req, res) => {
    db`SELECT * FROM posts`.then((result) => {
        res.send(result)
    })
});

// app.post('/login', async (request, response) => {
//         const { username, password } = request.body
//         const findUser = await sql`SELECT * FROM users WHERE username = ${username} AND password = ${password};`;

//         if (findUser && findUser.length > 0) {
//             response.send(findUser);
//         }
//         response.send({ error: true, message: 'wrong input information!' });
// });

app.post('/login', async (request, response) => {
    const { username, password } = request.body;
    const findUser = await db`SELECT * FROM users WHERE username = ${username} AND password = ${password};`;
    if (findUser && findUser.length > 0) {
        response.send({ user: findUser[0] });
    } else {
        response.status(401).send({ error: true, message: 'Wrong username or password!' });
    }
});

// app.post('/signup', async (request, response) => {
//     try {
//         const user = request.body;
//         let sameUsername = [];
//         sameUsername.push(` username LIKE '%${username}%' `)
//         if(sameUsername = null){
//         const sqlUser = `INSERT INTO users (firstname, lastname, username, password, email) VALUES
//         ('${user.firstname}', '${user.lastname}', '${user.username}', '${user.password}', ${user.email}');`;
//         await sql.query(sqlUser);
//         response.send().status(204);}
//     } catch (e) {
//         response.status(500).send({ error: e.message });
//     }
// });

app.post('/signup', async (request, response) => {
    try {
        const user = request.body;

        const sqlUser =`INSERT INTO users (firstname, lastname, username, password, email) VALUES
            ('${user.firstname}', '${user.lastname}', '${user.username}', '${user.password}', '${user.email}');`;
        
        try {
            const result = await query(sqlUser);
            if (result) {
                response.status(204).send();
            } else {
                console.error("Failed to insert user data");
                response.status(500).send({ error: "Failed to insert user data" });
            }
        } catch (error) {
            console.error("Error executing SQL query:", error);
            response.status(500).send({ error: "Error executing SQL query" });
        }
    } catch (e) {
        console.error(e);
        response.status(500).send({ error: e.message });
    }
});






app.listen(port, () => console.log(` My App listening at http://localhost:${port}`));