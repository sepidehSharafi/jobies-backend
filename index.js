const express = require('express');
const { sql } = require('./core/Database');

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
    const tweets = await sql`select * from users`;
    response.send(tweets);
});

app.get('/posts', async (_, response) => {
    const tweets = await sql`select * from posts`;
    response.send(tweets);
});

app.post('/login', async (request, response) => {
    const { username, password } = request.body;
    const findUser = await sql`SELECT * FROM users WHERE username = ${username} AND password = ${password};`;
    if (findUser && findUser.length > 0) {
        response.send({ user: findUser[0] });
    } else {
        response.status(401).send({ error: true, message: 'Wrong username or password!' });
    }
});

app.post('/signup', async (request, response) => {
    try {
        const user = request.body;
        await sql`INSERT INTO users (firstname, lastname, username, password, email) VALUES
        ('${user.firstname}','${user.lastname}','${user.username}','${user.password}','${user.email}');`;
        // await sql(sqlUser);
            response.status(201).send({ user: { firstname, lastname, username, password, email } });
    } catch (e) {
        response.status(500).send({ error: e.message });
    }
});


app.post('/post', async (request, response) => {
    try {
        const post = request.body;
        const sqlPost = await sql`INSERT INTO posts (userID, username, postTitle, postContent,image_url, likes_count, dislikes_count) VALUES
        ('${post.userID}', '${post.username}', '${post.postTitle}', '${post.postContent}', ${post.image_url}, ${post.likes_count}, '${post.dislikes_count}');`;
        response.send().status(204);
    } catch (e) {
        response.status(500).send({ error: e.message });
    }
});

app.delete('/posts/:id', async (request, response) => {
    try {
        const id = +request.params.id;
        await sql`DELETE FROM posts WHERE id = $1;`;
        response.status(204).send();
    } catch (e) {
        console.log('e => ', e);
        response.status(500).send({ error: e.message });
    }
});

app.put('/posts/:id', async (request, response) => {
    try {
        const id = +request.params.id;
        const { title, content, image_url } = request.body;
        sql = await sql`UPDATE posts SET 
        postTitle = '${title}', 
            content = '${content}', 
            image_url = '${image_url}';`;
        
        response.status(204).send();
    } catch (e) {
        console.log('e => ', e);
        response.status(500).send({ error: e.message });
    }
});

app.get('/books/search', async (request, response) => {
    try {
        const title = request.query.postTitle;
        const likeSort = request.query.likes_count;
        const created_at = request.query.created_at;

        let sql = `SELECT * FROM posts`
        let filters = [];

        if (title) {
            filters.push(` postTitle LIKE '%${title}%' `)
        }
        
        if(created_at) {
        filters.push(` created_at = ${created_at}`)}

        if(likeSort) sqlSort += sql` ORDER BY likes_count ${likeSort}`;
        const { rows: posts } = sqlSort

        response.send(posts);
    } catch (e) {
        response.status(500).send({ error: e.message });
    }
});

app.listen(port, () => console.log(` My App listening at http://localhost:${port}`));