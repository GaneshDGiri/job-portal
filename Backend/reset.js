const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');
const User = require('./models/User');
const Application = require('./models/Application');
const bcrypt = require('bcryptjs');

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('✅ Connected to MongoDB');
    
    // Clear Data
    await Job.deleteMany({});
    await Application.deleteMany({});
    
    // Create Demo Employer
    let employer = await User.findOne({ email: "recruiter@demo.com" });
    if (!employer) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash("12345678", salt);
        employer = await User.create({
            name: "Demo Recruiter",
            email: "recruiter@demo.com",
            password: hash,
            role: "employer"
        });
    }

    // Seed Jobs
    const jobs = [
        { title: "React Developer", company: "TechCorp", location: "Remote", salary: "$80k", workMode: "Remote", jobType: "Full-time", description: "Join us!", skillsRequired: ["React"], expiresAt: new Date(+new Date() + 30*86400000), createdBy: employer._id },
        { title: "Node.js Engineer", company: "Backend Systems", location: "NY", salary: "$120k", workMode: "Onsite", jobType: "Contract", description: "Build APIs.", skillsRequired: ["Node"], expiresAt: new Date(+new Date() + 30*86400000), createdBy: employer._id }
    ];

    await Job.insertMany(jobs);
    console.log("✅ Database Reset & Seeded!");
    process.exit();
}).catch(err => console.error(err));