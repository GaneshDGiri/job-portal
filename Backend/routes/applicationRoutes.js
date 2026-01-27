const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure Multer for Resume Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// IMPORT CONTROLLERS
// IMPORTANT: These names must exist in applicationController.js
const { 
    applyForJob, 
    getMyApplications, 
    getJobApplicants, 
    deleteApplication, 
    updateStatus 
} = require('../controllers/applicationController');

// DEFINE ROUTES
router.post('/apply', auth, upload.single('resume'), applyForJob); // <--- This was crashing because applyForJob was missing
router.get('/my-applications', auth, getMyApplications);
router.get('/job/:jobId', auth, getJobApplicants);
router.delete('/:id', auth, deleteApplication);
router.put('/:id/status', auth, updateStatus);

module.exports = router;