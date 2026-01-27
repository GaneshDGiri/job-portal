const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Job = require('./models/Job');
const User = require('./models/User'); 

// Load env vars
dotenv.config();

// Job Data Arrays
const jobTitles = [
  "Frontend Developer", "Backend Developer", "Full Stack Engineer", 
  "Data Scientist", "UI/UX Designer", "DevOps Engineer", 
  "Product Manager", "QA Tester", "Mobile App Developer", "System Architect"
];

const companies = [
  "Google", "Amazon", "Microsoft", "Netflix", "Tesla", "Spotify", 
  "Adobe", "Salesforce", "TechStart", "InnovateX"
];

const locations = [
  "New York, NY", "San Francisco, CA", "Austin, TX", "Remote", 
  "London, UK", "Berlin, Germany", "Bangalore, India", "Pune, India", "Toronto, Canada"
];

const skillsList = [
  ["React", "Node.js", "CSS"],
  ["Python", "Django", "SQL"],
  ["Java", "Spring Boot", "AWS"],
  ["Figma", "Adobe XD", "Sketch"],
  ["Docker", "Kubernetes", "CI/CD"],
  ["JavaScript", "TypeScript", "Next.js"]
];

const seedJobs = async () => {
  try {
    // 1. Connect to Database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔌 Connected to MongoDB...");

    // 2. Create or Find Demo Employer
    const demoEmail = "recruiter@demo.com";
    let employer = await User.findOne({ email: demoEmail });
    
    if (!employer) {
      const hashedPassword = await bcrypt.hash("12345678", 10);
      employer = await User.create({
        name: "Demo Recruiter",
        email: demoEmail,
        password: hashedPassword,
        role: "employer"
      });
      console.log("👤 Created Demo Employer User");
    } else {
        console.log("👤 Found existing Demo Employer");
    }

    // 3. Clear old jobs
    await Job.deleteMany({});
    console.log("🗑️  Cleared old jobs");

    // 4. Generate 25 Random Jobs
    const jobs = [];
    for (let i = 0; i < 25; i++) {
      const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
      const randomSkills = skillsList[Math.floor(Math.random() * skillsList.length)];
      
      const daysUntilExpiry = Math.floor(Math.random() * 55) + 5; 
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + daysUntilExpiry);

      jobs.push({
        title: title,
        company: companies[Math.floor(Math.random() * companies.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        salary: ["$60k - $80k", "$12 - $18 LPA", "$80k - $120k", "Competitive", "$100k+"][Math.floor(Math.random() * 5)],
        
        // FIXED 1: "On-site" -> "Onsite"
        workMode: ["Remote", "Onsite", "Hybrid"][Math.floor(Math.random() * 3)],
        
        // FIXED 2: Removed "Part-time" since your Schema rejects it
        jobType: ["Full-time", "Internship", "Contract"][Math.floor(Math.random() * 3)],
        
        description: `We are hiring a ${title} to join our dynamic team. \n\nResponsibilities:\n- Build scalable applications\n- Collaborate with cross-functional teams.\n\nRequirements:\n- Proficiency in modern tech stacks.\n- Great problem-solving skills.`,
        skillsRequired: randomSkills,
        expiresAt: expiryDate,
        createdBy: employer._id
      });
    }

    // 5. Insert into DB
    await Job.insertMany(jobs);
    console.log(`✅ Successfully seeded ${jobs.length} jobs!`);
    
    process.exit();

  } catch (err) {
    console.error("❌ Seed Error:", err);
    process.exit(1);
  }
};

seedJobs();