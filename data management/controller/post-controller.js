const { dbConnection } = require("../../db_connection")

exports.postController = {
    async getPosts(req, res) {
        const dbConnection = require("../../db_connection")
        const connection = await dbConnection.createConnection()

        const filter = req.query.sort
        console.log("filter"+filter)
        let orderBy = "p.created_at DESC"
        let timeCondition = ""
        switch (filter) {
            case "old":
                orderBy = "p.created_at ASC";
                break;

            case "new":
                orderBy = "p.created_at DESC";
                break;

            case "day":
                timeCondition = "WHERE p.created_at >= NOW() - INTERVAL 1 DAY";
                break;

            case "week":
                timeCondition = "WHERE p.created_at >= NOW() - INTERVAL 7 DAY";
                break;

            case "month":
                timeCondition = "WHERE p.created_at >= NOW() - INTERVAL 1 MONTH";
                break;

            default:
                orderBy = "p.created_at DESC";
        }

        try {
            const [rows] = await connection.execute(`
                                            SELECT 
                                            p.*,
                                            IFNULL(COUNT(pl.user_id), 0) AS like_count,
                                            IFNULL(JSON_ARRAYAGG(pl.user_id), JSON_ARRAY()) AS likedByUsers
                                            FROM posts p
                                            LEFT JOIN post_likes pl 
                                            ON p.id = pl.post_id
                                            ${timeCondition}
                                            GROUP BY p.id
                                            ORDER BY ${orderBy}
                                            `)
            res.json(rows)
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
            const [rows] = await connection.execute(`
            SELECT 
                p.*, IFNULL(
                            JSON_ARRAYAGG(pl.user_id),
                            JSON_ARRAY()
                           ) AS likedByUsers
            FROM posts p
            LEFT JOIN post_likes pl 
                ON p.id = pl.post_id
            WHERE p.id = ?
            GROUP BY p.id
        `, [postid])

            res.json(rows[0])
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

        const { _userid, title, description,
            mediaType, mediaUrl, createdAt } = req.body

        const created_at = new Date(Number(createdAt))

        try {
            const [result] = await connection.execute(
                `INSERT INTO posts (user_id, title, description, media_type, media_url, created_at)
                 VALUES ( ?, ?, ?, ?, ?,  ?)`,
                [_userid, title, description,
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

    },
    async deletePost(req, res) {

    }
}