const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    // 1. WIPE EVERYTHING
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    console.log('🗑️  Database Wiped');

    // 2. CREATE RECRUITER
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash("12345678", salt);
    
    const recruiter = await User.create({
        name: "Test Recruiter",
        email: "recruiter@test.com",
        password: hash,
        role: "employer"
    });
    console.log('👤 Recruiter Created: recruiter@test.com / 12345678');

    // 3. CREATE SEEKER
    const seeker = await User.create({
        name: "Test Seeker",
        email: "seeker@test.com",
        password: hash,
        role: "seeker",
        skills: ["React", "Node.js"]
    });
    console.log('👤 Seeker Created: seeker@test.com / 12345678');

    // 4. CREATE JOB
    const job = await Job.create({
        title: "Senior React Developer",
        company: "Google",
        location: "Remote",
        salary: "$120k",
        workMode: "Remote",
        jobType: "Full-time",
        description: "We need a React expert.",
        skillsRequired: ["React"],
        expiresAt: new Date(+new Date() + 30*24*60*60*1000),
        createdBy: recruiter._id
    });
    console.log('💼 Job Created');

    // 5. CREATE APPLICATION (The Missing Link!)
    await Application.create({
        job: job._id,
        applicant: seeker._id,
        name: seeker.name,
        email: seeker.email,
        mobile: "9876543210",
        location: "New York",
        experience: "3 Years",
        skills: "React, Node, MongoDB",
        status: "Applied"
    });
    console.log('📄 Application Created Manually');

    console.log('✅ SETUP COMPLETE. PLEASE RESTART SERVER.');
    process.exit();
  })
  .catch(err => {
      console.error(err);
      process.exit(1);
  });