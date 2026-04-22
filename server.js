const dotenv = require('dotenv');
dotenv.config({ override: true }); // ? Give more priority to .env variables rather than those who exists by default

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoute = require('./routes/authRoute');
const initSchema = require('./config/initSchema');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Basic health check route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'API is running cleanly' });
});

// Routes
app.use('/api/v1/auth', authRoute);

// Initialize database and start server
const PORT = process.env.PORT || 8085;

const startServer = async () => {
    try {
        await initSchema();
        console.log("Database initialized successfully.");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
    }
};

startServer();