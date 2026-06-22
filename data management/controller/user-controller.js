const db = require("../../db_connection");

exports.userController = {

  async getUsers(req, res) {
    try {
      const result = await db.query(`
        SELECT 
          id, 
          username, 
          fullname, 
          email, 
          created_at, 
          birthday, 
          profile_pic_url, 
          user_type 
        FROM users 
        ORDER BY created_at DESC
      `);

      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },

  async addUser(req, res) {

    const { username, password, fullname, email, profile_pic_url, user_type } = req.body;

    try {
      const result = await db.query(
        `INSERT INTO users (username, password, fullname, email, profile_pic_url, user_type) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING id`,
        [username, password, fullname, email, profile_pic_url, user_type || 'user']
      );

      const newUserId = result.rows[0].id;

      res.status(201).json({ 
        success: true, 
        message: "User registered successfully!",
        userId: newUserId 
      });

    } catch (err) {
      console.error("Database Error:", err);

      if (err.code === '23505') {
        return res.status(400).json({ 
          success: false, 
          error: "Username or Email is already registered." 
        });
      }

      res.status(500).json({ 
        success: false, 
        error: "Internal server error during registration." 
      });
    }
  },

    async login(req, res) {
    const { username, password } = req.body;

    try {
      const result = await db.query(
        `SELECT id, username, password, fullname, email, profile_pic_url, user_type 
         FROM users 
         WHERE username = $1`,
        [username]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ 
          success: false, 
          error: "Invalid username or password." 
        });
      }

      const user = result.rows[0];

      if (user.password !== password) {
        return res.status(401).json({ 
          success: false, 
          error: "Invalid username or password." 
        });
      }

      delete user.password;

      res.json(user);

    } catch (err) {
      console.error("Login Controller Error:", err);
      res.status(500).json({ 
        success: false, 
        error: "Internal server error during login." 
      });
    }
  }
};
