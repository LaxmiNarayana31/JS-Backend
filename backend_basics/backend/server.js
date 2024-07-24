import express from 'express';
const app = express();

app.get('/', (req, resp) => {
    resp.send('Server is ready')
})

const port = process.env.PORT || 3000

const blogInfo = [
    {
        id: 1,
        title: "JavaScript",
        body: "JavaScript Blog"
    },
    {
        id: 2,
        title: "Python",
        body: "Python Blog"
    },
    {
        id: 3,
        title: "React",
        body: "React Blog"
    },
    {
        id: 4,
        title: "Java",
        body: "Java Blog"
    },
    {
        id: 5,
        title: "Node",
        body: "Node JS Blog"
    }
];


// http://localhost:3000/blogs
app.get('/api/blogs', (req, resp) => {
    resp.send(blogInfo)
})


app.listen(port, () => {
    console.log(`Serve at http://localhost:${port}`);
})