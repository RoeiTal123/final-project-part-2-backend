const { dbConnection } = require("../../db_connection")

exports.postController = {
    async getPosts(req,res){
        const dbConnection = require("../../db_connection")
        const connection = await dbConnection.createConnection()

        const [posts] = await connection.execute("SELECT * FROM posts")

        connection.end();
        res.json(posts);
    },
    async getPost(req,res){
        const postid  = req.params.postid
        const dbConnection = require("../../db_connection")
        const connection = await dbConnection.createConnection()

        const [row] = await connection.execute(`SELECT * FROM posts WHERE id = ${postid}`)

        connection.end();
        res.json(row[0]);
    },
    async addPost(req,res){
        
    },
    async deletePost(req,res){
        
    }
}