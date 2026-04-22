const mysql = require('mysql2/promise');

const host = process.env.MYSQL_HOST || 'localhost';
const port = Number(process.env.MYSQL_PORT) || 3306;
const user = process.env.MYSQL_USER || 'root';
const password = process.env.MYSQL_PASSWORD || 'YasH@12!';
const database = process.env.MYSQL_DATABASE || 'dbms_final_proj';

let poolPromise;

const initializePool = async () => {
    const bootstrapConnection = await mysql.createConnection({
        host,
        port,
        user,
        password
    });

    await bootstrapConnection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    await bootstrapConnection.end();

    return mysql.createPool({
        host,
        port,
        user,
        password,
        database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
};

const getPool = async () => {
    if (!poolPromise) {
        poolPromise = initializePool();
    }
    return poolPromise;
};

module.exports = {
    query: async (...args) => {
        const pool = await getPool();
        return pool.query(...args);
    },
    execute: async (...args) => {
        const pool = await getPool();
        return pool.execute(...args);
    },
    getPool
};
