const Job = require('../models/Job');
const User = require('../models/User');

// 1. CREATE JOB
exports.createJob = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        if (user.role !== 'employer') {
            return res.status(403).json({ msg: "Access Denied: Only Employers can post jobs." });
        }

        const { title, company, location, salary, workMode, jobType, description, skills, expiresAt } = req.body;

        if (!title || !company || !location || !salary || !description) {
            return res.status(400).json({ msg: "Missing required fields" });
        }

        // Process Skills
        let processedSkills = [];
        if (Array.isArray(skills)) {
            processedSkills = skills;
        } else if (typeof skills === 'string') {
            processedSkills = skills.split(',').map(s => s.trim()).filter(s => s !== "");
        }

        // FIXED: Set Expiry to END OF DAY (23:59:59)
        let finalExpiry = new Date(+new Date() + 30*24*60*60*1000); 
        if (expiresAt) {
            finalExpiry = new Date(expiresAt);
            finalExpiry.setHours(23, 59, 59, 999); 
        }

        const newJob = new Job({
            title, company, location, salary, workMode, jobType, description,
            skillsRequired: processedSkills,
            expiresAt: finalExpiry,
            createdBy: req.user.id
        });

        await newJob.save();
        res.status(201).json(newJob);

    } catch (err) {
        console.error("❌ Job Creation Error:", err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
};

// 2. GET ALL JOBS
exports.getJobs = async (req, res) => {
    try {
        const { keyword, location, type, workMode } = req.query;
        let query = { expiresAt: { $gt: new Date() } }; // Show only active jobs

        if (keyword) query.title = { $regex: keyword, $options: 'i' };
        if (location) query.location = { $regex: location, $options: 'i' };
        
        // FIXED: Only add filter if it is NOT empty
        if (type && type.trim() !== "") query.jobType = type;
        if (workMode && workMode.trim() !== "") query.workMode = workMode;

        const jobs = await Job.find(query).sort({ postedAt: -1 });
        res.json(jobs);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// ... (Keep getMyJobs and deleteJob same as before) ...
exports.getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ createdBy: req.user.id }).sort({ postedAt: -1 });
        res.json(jobs);
    } catch (err) { res.status(500).send('Server Error'); }
};

exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ msg: 'Job not found' });
        if (job.createdBy.toString() !== req.user.id) return res.status(401).json({ msg: 'Unauthorized' });
        await Job.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Job Removed' });
    } catch (err) { res.status(500).send('Server Error'); }
};