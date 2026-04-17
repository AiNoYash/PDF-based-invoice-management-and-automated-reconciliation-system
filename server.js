require('dotenv').config({ override: true });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoute = require('./routes/authRoute');
const UserModel = require('./model/userModel');
const initSchema = require('./config/initSchema');
const appRoute = require('./routes/appRoute');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1', appRoute);

// Basic health check route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'API is running' });
});

// Protected route example
const authMiddleware = require('./middleware/authMiddleware');
app.get('/api/v1/user/profile', authMiddleware, async (req, res) => {
    const user = await UserModel.findById(req.user.userId);
    res.status(200).json({ user });
});

// Initialize database and start server
const PORT = process.env.PORT || 8005;

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
