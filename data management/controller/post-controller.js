const { dbConnection } = require("../../db_connection")

exports.postController = {
    async getPosts(req, res) {
        const dbConnection = require("../../db_connection")
        const connection = await dbConnection.createConnection()

        const filter = req.query.sort
        console.log("filter =", req.query.sort);

        let whereClause = "";
        let orderBy = "p.created_at DESC";

        switch (filter) {
            case "old":
                orderBy = "p.created_at ASC";
                break;

            case "new":
                orderBy = "p.created_at DESC";
                break;

            case "day":
                whereClause = "WHERE p.created_at >= NOW() - INTERVAL 1 DAY";
                break;

            case "week":
                whereClause = "WHERE p.created_at >= NOW() - INTERVAL 7 DAY";
                break;

            case "month":
                whereClause = "WHERE p.created_at >= NOW() - INTERVAL 1 MONTH";
                break;
        }

        try {
            const [posts] = await connection.execute(`
            SELECT 
            p.*,
            IFNULL(JSON_ARRAYAGG(pl.user_id), JSON_ARRAY()) AS likedByUsers
            FROM posts p
            LEFT JOIN post_likes pl 
            ON p.id = pl.post_id
            ${whereClause}
            GROUP BY p.id
            ORDER BY ${orderBy}
            `);
            res.json(posts)
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
        finally {
            connection.end()
        }
    },
    async getPost(req, res) {
        const postid = req.params.postid
        const dbConnection = require("../../db_connection")
        const connection = await dbConnection.createConnection()

        try {
            const [posts] = await connection.execute(`
            SELECT 
                p.*, IFNULL(JSON_ARRAYAGG(pl.user_id),JSON_ARRAY()) AS likedByUsers
            FROM posts p
            LEFT JOIN post_likes pl 
                ON p.id = pl.post_id
            WHERE p.id = ?
            GROUP BY p.id
        `, [postid])

            res.json(posts[0])
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
        finally {
            connection.end()
        }
    },
    async addPost(req, res) {
        const dbConnection = require("../../db_connection")
        const connection = await dbConnection.createConnection()

        console.log("PUT /posts HIT");
        console.log(req.body);

        const { user_id, title, description,
            mediaType, mediaUrl, createdAt } = req.body

        const created_at = new Date(Number(createdAt))

        try {
            const [result] = await connection.execute(
                `INSERT INTO posts (user_id, title, description, media_type, media_url, created_at)
                 VALUES ( ?, ?, ?, ?, ?,  ?)`,
                [user_id, title, description,
                    mediaType, mediaUrl, created_at])

            res.status(201).json({
                success: true,
                postid: result.insertId
            })
        }
        catch (err) {
            console.error(err)

            res.status(500).json({
                success: false,
                error: err.message
            })
        }
        finally {
            connection.end()
        }
    },
    async updatePost(req, res) {
        const dbConnection = require("../../db_connection")
        const connection = await dbConnection.createConnection()
    },
    async deletePost(req, res) {
        const dbConnection = require("../../db_connection")
        const connection = await dbConnection.createConnection()

        console.log("DELETE /posts HIT");
        console.log("PARAMS:", req.params);

        const { postid } = req.params;

        try {
            const [result] = await connection.execute(
                "DELETE FROM posts WHERE id = ?",
                [postid]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Post not found"
                });
            }

            res.json({
                success: true,
                deletedId: postid
            });
        }
        catch (err) {
            console.error(err);

            res.status(500).json({
                success: false,
                error: err.message
            });
        }
        finally {
            connection.end();
        }
    }
}