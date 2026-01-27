const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, required: true },
    workMode: { type: String, enum: ['Remote', 'Onsite', 'Hybrid'], required: true },
    jobType: { type: String, enum: ['Full-time', 'Internship', 'Contract'], required: true },
    description: { type: String, required: true },
    
    // Ensure this is an Array of Strings
    skillsRequired: { type: [String], default: [] },
    
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date }
});

module.exports = mongoose.model('Job', JobSchema);