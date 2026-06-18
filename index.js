const cors = require("cors");
const express = require("express")
const app = express()
const fs = require("fs")
const path = require("path")
require("dotenv").config();

const { postRouter } = require("./data management/router/post-router.js")
const { userRouter } = require("./data management/router/user-router.js")

app.use(express.json())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/posts", postRouter)
app.use("/api/users", userRouter)

app.listen(3000,() => {
    console.log("server running on 3000")
})