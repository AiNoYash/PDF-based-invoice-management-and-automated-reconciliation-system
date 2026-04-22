const db = require('./db');
const fs = require('fs');
const path = require('path');


const initSchema = async () => {
    const pool = await db.getPool();

    const sqlFilePath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(sqlFilePath, 'utf8');

    // Split into individual queries and remove empty strings
    const queries = schemaSql
        .split(';')
        .map(query => query.trim())
        .filter(query => query.length > 0);

    // Execute each query sequentially
    for (const query of queries) {
        await pool.query(query);
    }

};

module.exports = initSchema;