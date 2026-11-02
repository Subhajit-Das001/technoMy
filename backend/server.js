const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables explicitly from the backend folder.
const envPath = path.resolve(__dirname, '.env');
const fallbackEnvPath = path.resolve(__dirname, '..', '.env');
const envResult = dotenv.config({ path: envPath });
if (envResult && envResult.error && fs.existsSync(fallbackEnvPath)) {
  dotenv.config({ path: fallbackEnvPath });
}
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const EventEmitter = require('events');
const helmet = require('helmet');
const { globalLimiter } = require('./middleware/auth');
// --- BULL-BOARD DASHBOARD SETUP ---
let createBullBoard;
let BullMQAdapter;
let ExpressAdapter;
let serverAdapter = null;

try {
  const bullApi = require('@bull-board/api');
  const bullMqAdapter = require('@bull-board/api/bullMQAdapter');
  const bullExpress = require('@bull-board/express');
  createBullBoard = bullApi.createBullBoard;
  BullMQAdapter = bullMqAdapter.BullMQAdapter;
  ExpressAdapter = bullExpress.ExpressAdapter;
} catch (error) {
  console.warn('Bull Board dashboard disabled because the package is unavailable in this environment:', error.message);
}

const basicAuth = require('express-basic-auth');
const { testQueue, csvProcessingQueue, resendMailingQueue,smtpMailingQueue } = require("./config/queue")
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
const uploadCSVRouter = require('./routes/centre');
const authRoutes = require('./routes/authRoutes');
const contestRoutes = require('./routes/contestRoutes');
const centerListRoutes = require('./routes/center_list_route');
const technopediaRoutes = require('./routes/Technopedia_Route');
const merchAnalyticsRoutes = require('./routes/merchAnalytics');
const cosPortalRoutes = require('./routes/cos_portal');
const offlineRegUpload = require('./routes/OfflineRegUpload');
const resendMailRoutes = require('./routes/resendMailingRoutes');

// Configure event emitter
EventEmitter.defaultMaxListeners = 20;
process.setMaxListeners(20);

const writableRoot = fs.existsSync('/tmp') ? '/tmp' : process.cwd();
const uploadDir = path.resolve(writableRoot, 'uploads', 'cos');

if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (error) {
    console.warn('Could not create upload directory at', uploadDir, error.message);
  }
}

const app = express();

// ==========================================
//  Load Redis Workers
// ==========================================
require('./workers/testWorker');
require('./workers/csvWorker');
require('./workers/smtpWorker');
require('./workers/emailWorker');

// Initialize the Express Adapter only if the dashboard package is available
if (createBullBoard && BullMQAdapter && ExpressAdapter) {
  serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/api/admin/queues');

  // Attach your queues to the board
  createBullBoard({
    queues: [
      new BullMQAdapter(testQueue),
      new BullMQAdapter(csvProcessingQueue),
      new BullMQAdapter(resendMailingQueue),
      new BullMQAdapter(smtpMailingQueue)
    ],
    serverAdapter: serverAdapter,
  });
}

//Bull-Dashboard Auth
const adminAuth = basicAuth({
  users: {
    // Fetches credentials securely from your .env file
    [process.env.BULL_ADMIN_USER]: process.env.BULL_ADMIN_PASS
  }, 
  challenge: true, // Triggers the native browser login popup
  unauthorizedResponse: 'Unauthorized: Access to the queue dashboard is securely restricted.'
});

app.use(express.json({ limit: '50mb' }))

if (serverAdapter) {
  app.use('/api/admin/queues', adminAuth, serverAdapter.getRouter());
}
// ==========================================
// 1. SECURITY & CORS (MUST BE FIRST)
// ==========================================
app.use(helmet());
const allowedOrigins = [
  'http://localhost:3000',  // React dev server
  'http://localhost:3001',  // Backend server
  'http://localhost:5173',  // Vite default
  'https://technothlon.techniche.org.in',
  'https://www.technothlon.techniche.org.in',
  'https://technothlon-25.vercel.app' ,
  'https://technomy.vercel.app' //testing website
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Origin ${origin} not allowed by CORS`);
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight requests
// ==========================================
// 2. BODY PARSERS (MUST BE BEFORE ROUTES)
// ==========================================
// Specific Body Limits for CSV Uploads
app.use('/api/uploadcsv', express.json({ limit: '5mb' }));
app.use('/api/uploadcsv', express.urlencoded({ limit: '5mb', extended: true }));
app.use('/api/centre', express.json({ limit: '5mb' }));
app.use('/api/centre', express.urlencoded({ limit: '5mb', extended: true }));
app.use('/api/offlineReg', express.json({ limit: '5mb' }));
app.use('/api/offlineReg', express.urlencoded({ limit: '5mb', extended: true }));

// Global Body Limits
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));

// ==========================================
// 3. UNRESTRICTED ROUTES (BEFORE RATE LIMITER)
// ==========================================
// This route now has CORS and Body Parsing, but no rate limiting!
app.use('/api/technopedia', technopediaRoutes);
app.use('/api/contest', contestRoutes);
app.use('/api/v1/emails', resendMailRoutes);
// ==========================================
// 4. RATE LIMITER
// ==========================================
app.set("trust proxy", 1);
app.use('/api', globalLimiter);

// ==========================================
// 5. RESTRICTED ROUTES (AFTER RATE LIMITER)
// ==========================================
app.use('/api', teamRoutes);
app.use('/dashboard', dashRoutes);
app.use('/api/uploadcsv', uploadCsv);
app.use('/api/feedback', feedback);
app.use('/api/centre', uploadCSVRouter);
app.use('/api/cityreps', cityRepRoutes);
app.use('/api', CityStudentCount);
app.use('/api/announcement', announcementRoutes);
app.use('/api/cityrep_portal', Cityrepportal);
app.use('/api/auth', authRoutes);
app.use('/api', centerListRoutes);
app.use('/api/merch', merchAnalyticsRoutes);
app.use('/api/cos_portal', cosPortalRoutes);
app.use('/api/offlineReg', offlineRegUpload);
// Root route
app.get('/health', (req, res) => {
  res.send("Hello from Technothlon Server");
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
//test
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Technothlon Backend is running!"
  });
});
//Test- route for Redis 
app.get('/api/test-redis', async (req, res) => {
  try {
    const job = await testQueue.add('Test-Job', {
      testMessage: 'Hello from Express!',
      timestamp: Date.now()
    });
    res.json({
      success: true,
      message: 'Job pushed to queue!',
      jobId: job.id
    });
  }
  catch (err) {
    res.status(500).json({ error: "Failed to push the job", details: err.message });
  }
})

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));



