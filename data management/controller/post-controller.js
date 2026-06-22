const { dbConnection } = require("../../db_connection")

exports.postController = {
    async getPosts(req, res) {
        const db = require("../../db_connection");

        const filter = req.query.sort
        console.log("filter =", req.query.sort);

        let whereClause = "";
        let orderBy = "p.created_at DESC";
        let values = [];

        switch (filter) {
            case "old":
                orderBy = "p.created_at ASC";
                break;

            case "new":
                orderBy = "p.created_at DESC";
                break;

            case "day":
                whereClause = "WHERE p.created_at >= NOW() - INTERVAL '1 DAY'";
                break;

            case "week":
                whereClause = "WHERE p.created_at >= NOW() - INTERVAL '7 DAY'";
                break;

            case "month":
                whereClause = "WHERE p.created_at >= NOW() - INTERVAL '1 MONTH'";
                break;
        }

        try {
            const result = await db.query(`
            SELECT 
                p.*,
                COALESCE(json_agg(pl.user_id) FILTER (WHERE pl.user_id IS NOT NULL), '[]') AS "likedByUsers"
            FROM posts p
            LEFT JOIN post_likes pl 
                ON p.id = pl.post_id
            ${whereClause}
            GROUP BY p.id
            ORDER BY ${orderBy}
            `);

            res.json(result.rows);
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
        finally {

        }
    },
    async getPost(req, res) {
        const postid = req.params.postid
        const db = require("../../db_connection");

        try {
            const posts = await db.query(`
            SELECT 
            p.*,
            COALESCE(
           json_agg(pl.user_id) FILTER (WHERE pl.user_id IS NOT NULL),
           '[]'::json
           ) AS likedByUsers
            FROM posts p
            LEFT JOIN post_likes pl 
            ON p.id = pl.post_id
            WHERE p.id = $1
            GROUP BY p.id;
        `, [postid])
            const post = posts.rows[0];
            res.json(post)
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    },
    async addPost(req, res) {
        const db = require("../../db_connection");

        console.log("PUT /posts HIT");
        console.log(req.body);

        const { user_id, title, description,
            mediaType, mediaUrl, createdAt } = req.body

        const created_at = new Date(Number(createdAt))

        try {
            const result = await db.query(
                `INSERT INTO posts (user_id, title, description, media_type, media_url, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
                [user_id, title, description,
                    mediaType, mediaUrl, created_at])

            res.status(201).json({
                success: true,
                postid: result.rows[0].id
            })
        }
        catch (err) {
            console.error(err)

            res.status(500).json({
                success: false,
                error: err.message
            })
        }
    },
    async updatePost(req, res) {
        const db = require("../../db_connection");

        console.log("PUT /posts HIT");
        console.log(req.body);

        const {
            id,
            user_id,
            title,
            description,
            media_type,
            media_url,
            created_at
        } = req.body;
        try {
            const result = await db.query(
                `UPDATE posts
                SET title = $1, description = $2, media_type = $3, media_url = $4
                WHERE id = $5`,
                [title, description, media_type, media_url, id]
            );

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

        }
    },
    async deletePost(req, res) {
        const db = require("../../db_connection");

        console.log("DELETE /posts HIT");
        console.log("PARAMS:", req.params);

        const { postid } = req.params;

        try {
            const result = await db.query(
                "DELETE FROM posts WHERE id = $1",
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

        }
    }
}