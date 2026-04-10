let pool;

const connectDB = async () => {
	const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

	if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
		console.warn("MySQL environment variables are not fully set. Server will start without database connection.");
		return;
	}

	try {
		const mysql = require("mysql2/promise");
		pool = mysql.createPool({
			host: MYSQL_HOST,
			port: Number(MYSQL_PORT || 3306),
			user: MYSQL_USER,
			password: MYSQL_PASSWORD || "",
			database: MYSQL_DATABASE,
			waitForConnections: true,
			connectionLimit: 10,
			queueLimit: 0
		});

		await pool.query("SELECT 1");
		await pool.query(
			`CREATE TABLE IF NOT EXISTS users (
				id INT AUTO_INCREMENT PRIMARY KEY,
				username VARCHAR(100) NOT NULL,
				email VARCHAR(191) NOT NULL UNIQUE,
				password VARCHAR(255) NOT NULL,
				phone VARCHAR(30) NOT NULL,
				address TEXT,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)`
		);

		console.log("MySQL connected successfully");
	} catch (error) {
		console.error("MySQL connection failed:", error.message);
	}
};

const runQuery = async (sql, params = []) => {
	if (!pool) {
		throw new Error("Database is not connected. Configure MySQL env vars and restart server.");
	}
	return pool.execute(sql, params);
};

module.exports = { connectDB, runQuery };
