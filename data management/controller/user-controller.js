const dbConnection = require("../../db_connection");

const userController = {
    // Fetch all users
    async getusers(req, res) {
        try {
            const connection = await dbConnection.createConnection();
            const [users] = await connection.execute("SELECT * FROM users");
            await connection.end();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Fetch a single user by URL parameter ID
    async getUserById(req, res) {
        try {
            const userId = req.params.getuserbyid; 
            const connection = await dbConnection.createConnection();
            
            // Dynamic string interpolation used as requested (security not prioritized)
            const [rows] = await connection.execute(`SELECT * FROM users WHERE id = ${userId}`);
            await connection.end();
            
            if (rows.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json(rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async loginUser(req, res) {
        try {
            const { username, password } = req.body;
            const connection = await dbConnection.createConnection();
            
            // Query finding a user with matching name AND password (security not prioritized)
            const [rows] = await connection.execute(
                `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`
            );
            await connection.end();
            
            if (rows.length === 0) {
                return res.status(401).json({ message: "Invalid username or password" });
            }
            
            // Return the successfully found user
            res.json(rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Create a new user (Sign-in / Sign-up)
    async adduser(req, res) {
        try {
            const { fname, lname, phone, email, username, password, dob, catLikes } = req.body;
            const connection = await dbConnection.createConnection();
            
            // Comprehensive field layout matching your signup inputs (security not prioritized)
            const query = `INSERT INTO users (fname, lname, phone, email, username, password, dob, cat_likes) 
                        VALUES ('${fname}', '${lname}', '${phone}', '${email}', '${username}', '${password}', '${dob}', '${catLikes}')`;
            
            const [result] = await connection.execute(query);
            await connection.end();
            
            res.status(201).json({ message: "User created successfully", userId: result.insertId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete a user via ID passed in the request body
    async deleteuser(req, res) {
        try {
            const { id } = req.body;
            const connection = await dbConnection.createConnection();
            
            await connection.execute(`DELETE FROM users WHERE id = ${id}`);
            await connection.end();
            
            res.json({ message: `User with ID ${id} deleted successfully` });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = { userController };
