const express = require('express');
const router = express.Router();
// Ensure all 4 functions are imported here
const { getJobs, getMyJobs, createJob, deleteJob } = require('../controllers/jobController');
const auth = require('../middleware/authMiddleware');

router.get('/', getJobs); // This is where your error was (line 6)
router.post('/', auth, createJob);
router.get('/my-jobs', auth, getMyJobs);
router.delete('/:id', auth, deleteJob);

module.exports = router;