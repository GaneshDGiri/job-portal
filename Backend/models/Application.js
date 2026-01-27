const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    resume: { type: String },
    
    status: { 
        type: String, 
        enum: ['Applied', 'Shortlisted', 'Interview', 'Hired', 'Rejected'], 
        default: 'Applied' 
    },

    // --- INTERVIEW DETAILS ---
    interviewDate: { type: Date }, // Stores Date & Time together
    interviewLink: { type: String },
    interviewerName: { type: String }, // New Field

    appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);
