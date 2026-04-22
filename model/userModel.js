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
        const { username, email, password_hash } = userData;
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, password_hash]
        );
        return result.insertId;
    }
}

module.exports = UserModel;
