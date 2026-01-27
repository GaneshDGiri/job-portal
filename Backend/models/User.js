const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['employer', 'seeker'], required: true },
    
    // Basic Info
    mobile: { type: String },
    location: { type: String },
    bio: { type: String }, // Professional Summary
    
    // Structured Data Arrays
    education: [
        { degree: String, institute: String, year: String }
    ],
    workExperience: [ // <--- NEW STRUCTURED FIELD
        { role: String, company: String, duration: String, description: String }
    ],
    projects: [
        { title: String, description: String, link: String }
    ],
    certifications: [
        { name: String, issuer: String, credentialId: String }
    ],
    customDetails: [ 
        { title: String, value: String }
    ],
    
    additionalDetails: {
        hometown: String,
        dob: String,
        salaryExpectation: String,
        gender: String
    },

    skills: {
        languages: [String],
        tools: [String],
        databases: [String]
    },

    profilePic: { type: String },
    resume: { type: String },
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);