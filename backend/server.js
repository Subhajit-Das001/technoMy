const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const EventEmitter = require('events');



const teamRoutes = require('./routes/teamRouter');
const dashRoutes = require('./routes/dashRouter');
const uploadCsv = require('./routes/uploadCsv');
const feedback = require('./routes/feedback');
const cityRepRoutes = require('./routes/cityrep'); // Import cityrep routes
// const cityRepRoutes=require('./routes/cityrep')

const CityStudentCount = require('./routes/citystudentcountroute'); // Import cityrep routes

const Announcement=require('./routes/announcementRoutes');

const Cityrepportal = require('./routes/cityrep_portal');


// const contestRoutes = require('./routes/contestRoutes');  // Import contest routes
// const contestScoreRoutes = require('./routes/contestScoreRoutes');  // Import contest score routes

const questionsRouter = require('./routes/questionRouter');
const answerRouter = require('./routes/answerRouter');
const techpedResult = require('./routes/techpedResult');
const scoreRouter = require('./routes/scoreRouter');
const checkAttemptRouter = require('./routes/checkAttemptRouter');
const uploadCSVRouter = require('./routes/centre'); 
const { ppid } = require('process');

EventEmitter.defaultMaxListeners = 20;
process.setMaxListeners(20);



dotenv.config();
connectDB();

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration for specific allowed origins
const allowedOrigins = [
    'http://localhost:3000', // Local development URL
    'https://technothlon.techniche.org.in' // Production URL
];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

// CORS middleware
app.use(cors(corsOptions));

// Use route handlers
app.use('/api', teamRoutes);
app.use('/dashboard', dashRoutes);
app.use('/api/uploadcsv', uploadCsv);
app.use('/api/feedback', feedback);
app.use('/api', questionsRouter);
app.use('/api', answerRouter);
app.use('/api', techpedResult);
app.use('/api', scoreRouter);
app.use('/api', checkAttemptRouter);
app.use('/api/centre', uploadCSVRouter);
app.use('/api/cityreps', cityRepRoutes);
app.use('/api',CityStudentCount)
app.use('/api',Announcement);
app.use('/api/cityrep_portal',Cityrepportal);


app.get('/', (req, res) => {
    res.send("Hello from Technothlon Server");
});

// Port setup
const PORT = process.env.PORT || 4000;

// Start server
app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
