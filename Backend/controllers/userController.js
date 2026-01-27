const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER USER
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role, mobile } = req.body;
        
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User
        user = new User({ 
            name, email, mobile, role, 
            password: hashedPassword 
        });

        await user.save();

        // Create Token
        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name, email, role, mobile } });
        });

    } catch (err) {
        console.error("Register Error:", err.message);
        res.status(500).send('Server Error');
    }
};

// 2. LOGIN USER
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check User
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        // Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        // Return Token & User Data
        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) throw err;
            res.json({ 
                token, 
                user: { 
                    id: user.id, 
                    name: user.name, 
                    email: user.email, 
                    role: user.role, 
                    profilePic: user.profilePic 
                } 
            });
        });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).send('Server Error');
    }
};

// 3. GET CURRENT USER PROFILE
exports.getMe = async (req, res) => {
    try {
        // Fetch user by ID (from token) and exclude password
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error("GetMe Error:", err.message);
        res.status(500).send('Server Error');
    }
};

// 4. UPDATE USER PROFILE (Includes Work Experience & Arrays)
exports.updateUserProfile = async (req, res) => {
    try {
        const { 
            name, mobile, location, bio, 
            skillLanguages, skillTools, skillDatabases, 
            position, companyName, companyDescription,
            // Complex JSON String Fields
            education, workExperience, projects, certifications, customDetails, additionalDetails 
        } = req.body;
        
        let updateData = { 
            name, mobile, location, bio,
            position, companyName, companyDescription
        };

        // --- HANDLE ARRAYS & OBJECTS (Parse JSON strings) ---
        // We use try-catch to prevent crashing if JSON is invalid
        if (education) {
            try { updateData.education = JSON.parse(education); } catch(e) {}
        }
        if (workExperience) {
            try { updateData.workExperience = JSON.parse(workExperience); } catch(e) {}
        }
        if (projects) {
            try { updateData.projects = JSON.parse(projects); } catch(e) {}
        }
        if (certifications) {
            try { updateData.certifications = JSON.parse(certifications); } catch(e) {}
        }
        if (customDetails) {
            try { updateData.customDetails = JSON.parse(customDetails); } catch(e) {}
        }
        if (additionalDetails) {
            try { updateData.additionalDetails = JSON.parse(additionalDetails); } catch(e) {}
        }

        // --- HANDLE SKILLS (Languages, Tools, Databases) ---
        if (skillLanguages || skillTools || skillDatabases) {
             updateData.skills = {
                 languages: skillLanguages ? skillLanguages.split(',').map(s => s.trim()) : [],
                 tools: skillTools ? skillTools.split(',').map(s => s.trim()) : [],
                 databases: skillDatabases ? skillDatabases.split(',').map(s => s.trim()) : []
             };
        }

        // --- HANDLE FILE UPLOADS ---
        if (req.files) {
            if (req.files.profilePic) {
                updateData.profilePic = req.files.profilePic[0].path;
            }
            if (req.files.resume) {
                updateData.resume = req.files.resume[0].path;
            }
        }

        // Update Database
        const user = await User.findByIdAndUpdate(
            req.user.id, 
            { $set: updateData }, 
            { new: true }
        ).select('-password');

        res.json(user);

    } catch (err) {
        console.error("Update Profile Error:", err.message);
        res.status(500).send('Server Error');
    }
};