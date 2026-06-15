const express = require("express")
const app = express()
const fs = require("fs")
const path = require("path")
app.use(express.json())

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

app.post("/chats", (req, res) => {
    console.log(req.body)
    res.json({ message: "received", data: req.body })
})

app.listen(3000,() => {
    console.log("server running on 3000")
})