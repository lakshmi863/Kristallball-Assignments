require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./config/db'); 

// Import Routes
const authRoutes = require('./routes/authRoutes');
const assetRoutes = require('./routes/assetRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const transferRoutes = require('./routes/transferRoutes');

// Import Global Logger
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const authenticateToken = require('./middlewares/authMiddleware');

const app = express();

// 1. Security & Core Middlewares
app.use(helmet()); // Protection headers
app.use(cors());   // Allow Frontend access
app.use(express.json()); // Body parser

// 2. Logging Middleware (Must be after auth context if using req.user)
// We apply authenticateToken globally to some routes so the logger knows WHO is acting
app.use('/api', loggerMiddleware);

// 3. Define API Routes
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/transfers', transferRoutes);

// 4. Health Check
app.get('/health', (req, res) => res.send('Kristallball Command API: Online'));

// 5. Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Command Error' });
});

// 6. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`-----------------------------------------------`);
    console.log(`KRISTALLBALL BACKEND STARTING ON PORT ${PORT}`);
    console.log(`DATABASE STATUS: ATTEMPTING CONNECTION...`);
    console.log(`-----------------------------------------------`);
});