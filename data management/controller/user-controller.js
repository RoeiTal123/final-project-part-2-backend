const { dbConnection } = require("../../db_connection")

exports.postController = {
    async getPosts(req,res){
        const dbConnection = require("../../db_connection")
        const connection = await dbConnection.createConnection()

        const [users] = await connection.execute("SELECT * FROM posts")

        connection.end();
        res.json(posts);
    },
    async getUserById(req,res){
        const { id: userId } = req.params; 

        const dbConnection = require("../../db_connection")
        const connection = await dbConnection.createConnection()

        const [row] = await connection.execute(`SELECT * FROM users WHERE id = ${userId}`)

        connection.end();
        res.json(row[0]);
    },
    async addPost(req,res){
        
    },
    async deletePost(req,res){
        
    }
}