const { runQuery } = require("../config/db.js");

const mapUser = (row) => {
    if (!row) {
        return null;
    }

    return {
        _id: row.id,
        username: row.username,
        email: row.email,
        password: row.password,
        phone: row.phone,
        address: row.address
    };
};

const usermodel = {
    findOne: async ({ email }) => {
        const normalizedEmail = (email || "").trim().toLowerCase();
        const [rows] = await runQuery(
            "SELECT id, username, email, password, phone, address FROM users WHERE LOWER(email) = ? LIMIT 1",
            [normalizedEmail]
        );
        return mapUser(rows[0]);
    },

    create: async ({ username, email, password, phone, address }) => {
        const normalizedEmail = (email || "").trim().toLowerCase();
        const [result] = await runQuery(
            "INSERT INTO users (username, email, password, phone, address) VALUES (?, ?, ?, ?, ?)",
            [username, normalizedEmail, password, phone, address || null]
        );

        return {
            _id: result.insertId,
            username,
            email: normalizedEmail,
            password,
            phone,
            address: address || null
        };
    }
};

module.exports = usermodel;
