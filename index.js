const express = require("express")
const app = express()
const fs = require("fs")
const path = require("path")
const cors = require("cors");

const { postRouter } = require("./data management/router/post-router.js")

app.use(express.json())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/posts", postRouter)

app.get("/",(req,res)=>{
    res.send(JSON.stringify(req.query))
    console.log(JSON.stringify(req.query))
})

app.post("/",(req,res)=>{
    res.send(JSON.stringify(req.params))
    console.log(JSON.stringify(req.params))
})

app.get("/users", (req, res) => {
    const filePath = path.join(__dirname, "data", "users.json")

    const data = fs.readFileSync(filePath, "utf-8")
    const users = JSON.parse(data)

    res.json(users)
})

app.get("/users/:id", (req, res) => {
    const userId = req.params.id

    const filePath = path.join(__dirname, "data", "users.json")
    const data = fs.readFileSync(filePath, "utf-8")
    const users = JSON.parse(data)
    
    const user = users.find(p => p._id === userId)

    if (!user) {
        return res.status(404).json({ error: "user not found" })
    }

    res.json(user)
})

app.post("/users", (req, res) => {
    console.log(req.body)
    res.json({ message: "received", data: req.body })
})

// ----------------------------------------------------------------

app.get("/posts", (req, res) => {
    const filePath = path.join(__dirname, "data", "posts.json")

    const data = fs.readFileSync(filePath, "utf-8")
    const posts = JSON.parse(data)

    res.json(posts)
})

app.get("/posts/:id", (req, res) => {
    const postId = req.params.id

    const filePath = path.join(__dirname, "data", "posts.json")
    const data = fs.readFileSync(filePath, "utf-8")
    const posts = JSON.parse(data)

    const post = posts.find(p => p._id === postId)

    if (!post) {
        return res.status(404).json({ error: "Post not found" })
    }

    res.json(post)
})

app.post("/posts", (req, res) => {
    console.log(req.body)
    res.json({ message: "received", data: req.body })
})

// ----------------------------------------------------------------

app.get("/communities", (req, res) => {
    const filePath = path.join(__dirname, "data", "communities.json")

    const data = fs.readFileSync(filePath, "utf-8")
    const communities = JSON.parse(data)

    res.json(communities)
})

app.get("/communitys/:id", (req, res) => {
    const communityId = req.params.id

    const filePath = path.join(__dirname, "data", "communitys.json")
    const data = fs.readFileSync(filePath, "utf-8")
    const communitys = JSON.parse(data)
    
    const community = communitys.find(p => p._id === communityId)

    if (!community) {
        return res.status(404).json({ error: "community not found" })
    }

    res.json(community)
})

app.post("/communities", (req, res) => {
    console.log(req.body)
    res.json({ message: "received", data: req.body })
})

// ----------------------------------------------------------------

app.get("/chats", (req, res) => {
    const filePath = path.join(__dirname, "data", "chats.json")

    const data = fs.readFileSync(filePath, "utf-8")
    const chats = JSON.parse(data)

    res.json(chats)
})

app.get("/chats/:id", (req, res) => {
    const chatId = req.params.id

    const filePath = path.join(__dirname, "data", "chats.json")
    const data = fs.readFileSync(filePath, "utf-8")
    const chats = JSON.parse(data)
    
    const chat = chats.find(p => p._id === chatId)

    if (!chat) {
        return res.status(404).json({ error: "chat not found" })
    }

    res.json(chat)
})

app.post("/chats", (req, res) => {
    console.log(req.body)
    res.json({ message: "received", data: req.body })
})

app.listen(3000,() => {
    console.log("server running on 3000")
})