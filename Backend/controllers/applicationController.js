const Application = require('../models/Application');
const Job = require('../models/Job');

// 1. APPLY FOR JOB
exports.applyForJob = async (req, res) => {
    try {
        const { jobId, name, email, mobile, location, experience, skills } = req.body;
        const resumePath = req.file ? req.file.path : ""; 

        // Check if already applied
        const existingApplication = await Application.findOne({ job: jobId, applicant: req.user.id });
        if (existingApplication) {
            return res.status(400).json({ msg: 'You have already applied for this job.' });
        }

        const newApplication = new Application({
            job: jobId,
            applicant: req.user.id,
            name, email, mobile, location, experience, skills,
            resume: resumePath,
            status: 'Applied'
        });

        await newApplication.save();
        res.status(201).json({ msg: 'Application Submitted Successfully!' });

    } catch (err) {
        console.error("❌ Application Error:", err.message);
        res.status(500).send('Server Error');
    }
};

// 2. GET MY APPLICATIONS (Seeker)
exports.getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user.id })
            .populate('job') 
            .sort({ appliedAt: -1 });
        res.json(applications);
    } catch (err) {
        console.error("❌ Get My Apps Error:", err.message);
        res.status(500).send('Server Error');
    }
};

// 3. GET JOB APPLICANTS (Recruiter)
exports.getJobApplicants = async (req, res) => {
    try {
        const { jobId } = req.params;
        
        // Populate applicant details from User model
        const applicants = await Application.find({ job: jobId })
            .populate('applicant', 'name email mobile resume profilePic') 
            .sort({ appliedAt: -1 });

        if (!applicants) return res.status(404).json({ msg: "No applicants found" });

        // Transform data
        const cleanApplicants = applicants.map(app => ({
            _id: app._id,
            name: app.name || app.applicant?.name || "Unknown",
            email: app.email || app.applicant?.email,
            mobile: app.mobile || app.applicant?.mobile,
            resume: app.resume || app.applicant?.resume, 
            status: app.status,
            appliedAt: app.appliedAt,
            skills: app.skills,
            experience: app.experience,
            
            // Interview Data
            interviewDate: app.interviewDate,
            interviewLink: app.interviewLink,
            interviewerName: app.interviewerName // <--- NEW FIELD
        }));

        res.json(cleanApplicants);
    } catch (err) {
        console.error("❌ Get Applicants Error:", err);
        res.status(500).send('Server Error');
    }
};

// 4. DELETE APPLICATION
exports.deleteApplication = async (req, res) => {
    try {
        await Application.findByIdAndDelete(req.params.id);
        res.json({ msg: "Application deleted successfully." });
    } catch (err) {
        console.error("❌ Delete Application Error:", err.message);
        res.status(500).send("Server Error");
    }
};

// 5. UPDATE STATUS / SCHEDULE INTERVIEW
exports.updateStatus = async (req, res) => {
    try {
        const { status, interviewDate, interviewLink, interviewerName, type } = req.body;
        
        let updateData = {};

        // LOGIC:
        // If "Send to Applicant" (type === 'send') -> Update Status to 'Interview'
        // If "Save Draft" (type === 'save') -> Don't change status (or keep existing)
        // If simple status update (Hire/Reject) -> Update status directly
        
        if (type === 'send') {
            updateData.status = 'Interview';
        } else if (status) {
            updateData.status = status; 
        }

        // Update Interview Details if provided
        if (interviewDate) updateData.interviewDate = new Date(interviewDate);
        if (interviewLink) updateData.interviewLink = interviewLink;
        if (interviewerName) updateData.interviewerName = interviewerName;

        const app = await Application.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true } // Return updated doc
        );

        res.json({ 
            msg: "Updated Successfully", 
            application: app 
        });

    } catch (err) {
        console.error("❌ Update Status Error:", err.message);
        res.status(500).send('Server Error');
    }
};

// ... keep existing applyForJob and getMyApplications ...