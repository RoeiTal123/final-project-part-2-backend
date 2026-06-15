const express = require("express")
const app = express()

app.get("/",(req,res)=>{
    res.send(JSON.stringify(req.query))
    console.log(JSON.stringify(req.query))
})

app.post("/",(req,res)=>{
    res.send(JSON.stringify(req.params))
    console.log(JSON.stringify(req.params))
})

app.listen(3000,() => {
    console.log("server running on 3000")
})