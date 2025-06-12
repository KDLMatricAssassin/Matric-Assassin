const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    importData();
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// The player data as provided
const playerData = `
[PASTE THE ENTIRE PLAYER DATA HERE]
`;

async function importData() {
    try {
        // Parse the text data
        const players = playerData.trim().split('\n').map(line => {
            const [name, surname, email, code, ...targetParts] = line.trim().split('\t');
            const target = targetParts.join(' ').trim();
            return {
                name: `${name} ${surname}`,
                email: email.trim(),
                verificationCode: code.trim(),
                isAdmin: false, // We'll set admins separately
                status: 'active',
                target: target
            };
        });

        // Add admin users (you can customize this list)
        const admins = [
            { name: 'Gadi Crouse', email: 'gadi@example.com', verificationCode: 'GADI2025', isAdmin: true, status: 'active' },
            { name: 'Tana Lyons', email: 'tana@example.com', verificationCode: 'TANA2025', isAdmin: true, status: 'active' },
            { name: 'Tevin Stoch', email: 'tevin@example.com', verificationCode: 'TEVIN2025', isAdmin: true, status: 'active' },
            { name: 'Ethan Atie', email: 'ethan@example.com', verificationCode: 'ETHAN2025', isAdmin: true, status: 'active' }
        ];

        // Clear existing users
        await User.deleteMany({});
        
        // Insert new users
        const allUsers = [...players, ...admins];
        const result = await User.insertMany(allUsers);
        
        console.log(`Successfully imported ${result.length} users`);
        
        // Now update targets based on names (this is a simplified approach)
        for (const user of players) {
            if (user.target) {
                const targetUser = await User.findOne({ name: user.target });
                if (targetUser) {
                    await User.updateOne(
                        { _id: user._id },
                        { $set: { target: targetUser._id } }
                    );
                }
            }
        }
        
        console.log('Successfully updated targets');
        process.exit(0);
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
}
