const express = require('express');
const cors = require('cors');
const TeamController = require('../controllers/teamController');

const router = express.Router();

router.use(cors({
    origin: "*",
    credentials: true
}));

router.post('/register', TeamController.createTeam);
// router.get('/verify', TeamController.verifyTeam);
router.put('/handlePayment', TeamController.handlePayment);
// router.post('/forgot-password', TeamController.forgotPassword);
// router.post('/reset-password', TeamController.resetPassword);

module.exports = router;