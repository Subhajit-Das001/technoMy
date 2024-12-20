const express=require('express');
const dashController=require('../controllers/dashController');

const router = express.Router();

router.get('/', dashController.listTeam);
router.get('/search', dashController.searchTeam);

module.exports = router;