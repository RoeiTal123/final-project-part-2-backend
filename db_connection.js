const mysql = require("mysql2/promise");

const dbConnection = {
    async createConnection() {
        console.log("=== ENV DEBUG ===");
        console.log("DB_HOST:", process.env.DB_HOST);
        console.log("DB_USER:", process.env.DB_USER);
        console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
        console.log("DB_NAME:", process.env.DB_NAME);
        console.log("=================");

        return await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
    }
};

module.exports = dbConnection;