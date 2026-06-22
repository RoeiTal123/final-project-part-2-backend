const { dbConnection } = require("../../db_connection")

exports.locationController = {
    async getLocations(req, res) {
        const dbConnection = require("../../db_connection")
        const connection = await dbConnection.createConnection()

        const filter = req.query.sort
        console.log("filter =", req.query.sort);

        let whereClause = "";
        let orderBy = "l.created_at DESC";

        switch (filter) {
            case "old":
                orderBy = "l.created_at ASC";
                break;

            case "new":
                orderBy = "l.created_at DESC";
                break;

            case "day":
                whereClause = "WHERE l.created_at >= NOW() - INTERVAL 1 DAY";
                break;

            case "week":
                whereClause = "WHERE l.created_at >= NOW() - INTERVAL 7 DAY";
                break;

            case "month":
                whereClause = "WHERE l.created_at >= NOW() - INTERVAL 1 MONTH";
                break;
        }

        try {
            const [locations] = await connection.execute(`
            SELECT 
            l.*,
            IFNULL(JSON_ARRAYAGG(lf.user_id), JSON_ARRAY()) AS Feeders
            FROM locations p
            LEFT JOIN location_feeders lf 
            ON l.id = lf.location_id
            ${whereClause}
            GROUP BY l.id
            ORDER BY ${orderBy}
            `);
            res.json(locations)
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
        finally {
            connection.end()
        }
    },
    async getLocation(req, res) {
        const locationid = req.params.locationid
        const dbConnection = require("../../db_connection")
        const connection = await dbConnection.createConnection()

        try {
            const [locations] = await connection.execute(`
            SELECT 
                l.*, IFNULL(JSON_ARRAYAGG(pl.user_id),JSON_ARRAY()) AS likedByUsers
            FROM locations p
            LEFT JOIN location_likes pl 
                ON l.id = pl.location_id
            WHERE l.id = ?
            GROUP BY l.id
        `, [locationid])

            res.json(locations[0])
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
        finally {
            connection.end()
        }
    },
    async addLocation(req, res) {
        const dbConnection = require("../../db_connection")
        const connection = await dbConnection.createConnection()

        console.log("PUT /locations HIT");
        console.log(req.body);

        const { user_id, title, description,
            mediaType, mediaUrl, createdAt } = req.body

        const created_at = new Date(Number(createdAt))

        try {
            const [result] = await connection.execute(
                `INSERT INTO locations (user_id, title, description, media_type, media_url, created_at)
                 VALUES ( ?, ?, ?, ?, ?,  ?)`,
                [user_id, title, description,
                    mediaType, mediaUrl, created_at])

            res.status(201).json({
                success: true,
                locationid: result.insertId
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
    async updateLocation(req, res) {
        const dbConnection = require("../../db_connection")
        const connection = await dbConnection.createConnection()

        console.log("PUT /locations HIT");
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
            const [result] = await connection.execute(
                `UPDATE locations
                SET title = ?, description = ?, media_type = ?, media_url = ?
                WHERE id = ?`,
                [title, description, media_type, media_url, id]
            );

            res.status(201).json({
                success: true,
                locationid: result.insertId
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
    async deleteLocation(req, res) {
        const dbConnection = require("../../db_connection")
        const connection = await dbConnection.createConnection()

        console.log("DELETE /locations HIT");
        console.log("PARAMS:", req.params);

        const { locationid } = req.params;

        try {
            const [result] = await connection.execute(
                "DELETE FROM locations WHERE id = ?",
                [locationid]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Location not found"
                });
            }

            res.json({
                success: true,
                deletedId: locationid
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