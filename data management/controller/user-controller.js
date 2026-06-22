const db = require("../../db_connection");

exports.userController = {
  async getUsers(req, res) {
    try {
      // Query all columns except the password for security
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
  }
};
