const cors = require("cors");
const express = require("express")
const app = express()
const fs = require("fs")
const path = require("path")
require("dotenv").config();
const cloudinary = require("./cloudinary.js");

const { postRouter } = require("./data management/router/post-router.js")
const { userRouter } = require("./data management/router/user-router.js")
const { locationRouter } = require("./data management/router/location-router.js")

process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT: ", err);
});

process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED: ", err);
});

app.use(express.json())

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://final-project-part-2-frontend.onrender.com"
  ],
  credentials: true
}));

app.use("/api/posts", postRouter)
app.use("/api/users", userRouter)
app.use("/api/locations", locationRouter)

app.listen(process.env.PORT || 3000);