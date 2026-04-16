const db = require('../config/db');

class UserModel {
    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT id, email, created_at FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(userData) {
        const { username, email, password, phone } = userData;
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password, phone) VALUES (?, ?, ?, ?)',
            [username, email, password, phone]
        );
        return result.insertId;
    }

    static async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) NOT NULL,
                email VARCHAR(191) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL, 
                phone VARCHAR(30) NOT NULL,
                address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await db.execute(query);
    }
}

module.exports = UserModel;
