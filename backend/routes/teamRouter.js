const express = require('express');
const cors = require('cors');
const TeamController = require('../controllers/teamController');

const router = express.Router();

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://technothlon.techniche.org.in'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

router.use(cors(corsOptions));

router.post('/register', TeamController.createTeam);
// router.get('/verify', TeamController.verifyTeam);
router.put('/handlePayment', TeamController.handlePayment);
// router.post('/forgot-password', TeamController.forgotPassword);
// router.post('/reset-password', TeamController.resetPassword);

module.exports = router;