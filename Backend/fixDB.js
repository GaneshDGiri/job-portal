// Backend/fixDB.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const fixUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 Connected to DB...');

        const usersCollection = mongoose.connection.db.collection('users');
        const users = await usersCollection.find({}).toArray();

        for (const user of users) {
            // Check if skills is an Array (Old Format) or undefined
            if (Array.isArray(user.skills) || !user.skills) {
                console.log(`🛠 Fixing user: ${user.name}`);
                
                // Convert Array (or null) to Object Structure
                const oldSkills = Array.isArray(user.skills) ? user.skills : [];
                
                const newSkills = {
                    languages: oldSkills, // Move existing skills here temporarily
                    tools: [],
                    databases: []
                };

                // Update the user directly in the DB
                await usersCollection.updateOne(
                    { _id: user._id },
                    { $set: { skills: newSkills } }
                );
            }
        }

        console.log('✅ Database successfully migrated to new format!');
        process.exit();
    } catch (err) {
        console.error('❌ Migration Error:', err);
        process.exit(1);
    }
};

fixUsers();