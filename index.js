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
    try {
        const tweets = await sql`select * from users`;
        response.status(204).send(tweets);
    }
    catch (e) {
        response.status(500).send({ error: e.message });
    }
});

app.get('/posts', async (request, response) => {
    try {
        const posts = await sql`select * from posts`;
        response.send(posts);
    } catch (e) {
        response.status(500).send({ error: e.message });
    }
});

app.get('/posts/comment', async (request, response) => {

    try {
        const { id } = request.params
        const comments = await sql`select * from comments where postid = ${id}`;
        response.send(comments);
    } catch (e) {
        response.status(500).send({ error: e.message });
    }
});

// app.get('/DisplayPost', async (request, response)=>{
//     try {
//         const postid = request.params.id
//         const post = await sql`select * from posts WHERE postID = ${postid}`;
//         console.log("post: ", post);
//         response.send(post);
//     } catch (e) {
//         response.status(500).send({ error: e.message });
//     }
// })

app.post('/login', async (request, response) => {
    try {
        const { username, password } = request.body;
        const findUser = await sql`SELECT * FROM users WHERE username = ${username} AND password = ${password};`;
        if (findUser && findUser.length > 0) {
            console.log(findUser);
            const { id, firstname, lastname, password, username, email } = findUser[0]
            response.send({ user: { userID: id, firstname, lastname, password, username, email } });
            console.log(response);
        } else {
            response.status(401).send({ error: true, message: 'Wrong username or password!' });
        }
    } catch (e) {
        response.status(500).send({ error: e.message });
    }
});

app.post('/signup', async (request, response) => {
    try {
        const user = request.body;
        console.log("user: ", user);
        const { firstname, lastname, password, username, email } = user
        await sql`INSERT INTO users (firstname, lastname, username, password, email) VALUES
        (${firstname},${lastname},${username},${password},${email});`;
        response.status(201).send({ user: { firstname, lastname, username, email } });
    } catch (e) {
        console.log(e);
        response.status(500).send({ error: e.message });
    }
});


app.post('/post', async (request, response) => {
    try {
        const post = request.body;
        console.log("post: ", post);
        const { userID, username, subject, content, imageURL } = post
        console.log("post values: ", userID, username, subject, content, imageURL);
        const sqlPost = await sql`INSERT INTO posts (userID, username, postTitle, postContent, image_url) VALUES
        (${userID}, ${username}, ${subject}, ${content}, ${imageURL});`;
        console.log("post:", sqlPost);
        response.status(201).send({ post: { userID, username, subject, content, imageURL } });
    } catch (e) {
        response.status(500).send({ error: e.message });
        console.error(e);
    }
});

app.post('/post/comment', async (request, response) => {
    try {
        const userComment = request.body;
        console.log("comment: ", userComment);
        const { id, userID, username, comment } = userComment
        console.log("post values: ", userID, username, id);
        const sqlPostComment = await sql`INSERT INTO comments (postID, userID,username,commentContent) VALUES
        (${id}, ${userID}, ${username}, ${comment});`;
        console.log("post:", sqlPostComment);
        response.status(201).send({ userComment: { id, userID, username, comment } });
    } catch (e) {
        response.status(500).send({ error: e.message });
        console.error(e);
    }
});



app.put('/post/like/:id', async (request, response) => {
    try {
        const id = request.params;
        const likeUpdate = await sql`UPDATE posts set likes_count = likes_count + 1 
        WHERE postid = ${id};`;
        console.log(likeUpdate);
        response.status(200).send();
    } catch (e) {
        console.log('e => ', e);
        response.status(500).send({ error: e.message });
    }
});

app.put('/post/update/:id', async (request, response) => {
    try {
        const id = request.params;
        const likeUpdate = await sql`UPDATE posts set postTitle =${subject}
        , postContent = ${content}
        , image_url = ${imageURL}
        WHERE postid = ${id};`;
        console.log(likeUpdate);
        response.status(200).send();
    } catch (e) {
        console.log('e => ', e);
        response.status(500).send({ error: e.message });
    }
});

app.delete('/posts/:id', async (request, response) => {
    try {
        const id = +request.params.id;
        console.log(id);
        // const userid = request.params.userID;
        await sql`DELETE FROM posts WHERE id = ${id};`;
        response.status(204).send();
    } catch (e) {
        console.log('e => ', e);
        response.status(500).send({ error: e.message });
    }
});

app.put('/displayPost/update/:id', async (request, response) => {
    try {
        const { subject, content, image_url } = request.body;
        sql = await sql`UPDATE posts SET 
        postTitle = ${subject}, 
            content = ${content}, 
            image_url = ${image_url}
            created_at = CURRENT_TIMESTAMP
            ;`;

        response.status(204).send();
    } catch (e) {
        response.status(500).send({ error: e.message });
    }
});

app.get('/posts/:id', async (request, response) => {
    try {
        const { id } = request.params;
        console.log(id);
        const findPost = await sql`SELECT * FROM posts WHERE postid = ${id}`;
        console.log(findPost);
        if (findPost && findPost.length > 0) {
            response.status(200).send(findPost[0]);
        } else {
            response.status(404)
        }

    } catch (e) {
        response.status(500).send({ error: e.message });
    }
})

app.get('/posts/search', async (request, response) => {
    // try {
    const post = request.body
    console.log("post", request);

    // let sql = `SELECT * FROM posts`

    //     const {subject, content} = post
    //     let filters = [];

    //     if (title) {
    //         const findPost = await sql`SELECT * FROM posts WHERE postTitle LIKE '%${subject}%'`
    //         filters = findPost
    //     }

    //     if (content) {
    //         const findPost = await sql`SELECT * FROM posts WHERE postContent LIKE '%${content}%'`
    //         filters = findPost
    //     }

    //     // if (likeSort) sqlSort += sql` ORDER BY likes_count ${likes_count}`;
    //     //  const { rows: posts } = sqlSort

    //     response.send(filters);
    // } catch (e) {
    //     response.status(500).send({ error: e.message });
    // }
});
app.get('/posts/sort', async (request, response) => {
    try {
        const { likes_count } = post
        if (likes_count) {
            const sqlSort = sql` ORDER BY likes_count ${likes_count}`;
            const { rows: posts } = sqlSort
            response.send(posts);
        }
    } catch (e) {
        response.status(500).send({ error: e.message });
    }
});

app.listen(port, () => console.log(` My App listening at http://localhost:${port}`));