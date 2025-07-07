const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const EventEmitter = require('events');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Import routes after database connection
const teamRoutes = require('./routes/teamRouter');
const dashRoutes = require('./routes/dashRouter');
const uploadCsv = require('./routes/uploadCsv');
const feedback = require('./routes/feedback');
const cityRepRoutes = require('./routes/cityrep');
const CityStudentCount = require('./routes/citystudentcountroute');
const announcementRoutes = require('./routes/announcementRoutes');
const Cityrepportal = require('./routes/cityrep_portal');
// const questionsRouter = require('./routes/questionRouter');
// const checkAttemptRouter = require('./routes/checkAttemptRouter');
const uploadCSVRouter = require('./routes/centre');
const authRoutes = require('./routes/authRoutes');
const contestRoutes = require('./routes/contestRoutes');
const centerListRoutes = require('./routes/center_list_route');
const technopediaRoutes = require('./routes/Technopedia_Route');
const merchAnalyticsRoutes = require('./routes/merchAnalytics');

// Configure event emitter
EventEmitter.defaultMaxListeners = 20;
process.setMaxListeners(20);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',  // React dev server
  'http://localhost:3001',  // Backend server
  'http://localhost:5173',  // Vite default
  'https://technothlon.techniche.org.in',
  // Add any other production URLs
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Origin ${origin} not allowed by CORS`);
      callback(null, true); // Still allow it for now, but log it
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

// Apply CORS before any routes
app.use(cors(corsOptions));

// For preflight requests
app.options('*', cors(corsOptions));

// Routes
app.use('/api', teamRoutes);
app.use('/dashboard', dashRoutes);
app.use('/api/uploadcsv', uploadCsv);
app.use('/api/feedback', feedback);
// app.use('/api', questionsRouter);
// app.use('/api', techpedResult);
// app.use('/api', scoreRouter);
// app.use('/api', checkAttemptRouter);
app.use('/api/centre', uploadCSVRouter);
app.use('/api/cityreps', cityRepRoutes);
app.use('/api', CityStudentCount);
app.use('/api/announcement', announcementRoutes);
app.use('/api/cityrep_portal', Cityrepportal);
app.use('/api', contestRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', centerListRoutes);
app.use('/api/technopedia', technopediaRoutes);
app.use('/api/merch', merchAnalyticsRoutes);
// Root route
app.get('/', (req, res) => {
    res.send("Hello from Technothlon Server");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
