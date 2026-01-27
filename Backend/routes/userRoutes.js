const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateUserProfile } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');

// File Upload Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ROUTES
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', auth, getMe); // <--- THIS fetches the profile

// Update Profile (Handles both Profile Pic and Resume)
router.put('/me', auth, upload.fields([{ name: 'profilePic' }, { name: 'resume' }]), updateUserProfile);

module.exports = router;