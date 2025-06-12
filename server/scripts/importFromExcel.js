const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');

// Function to hash password
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

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

async function processSheet(worksheet, isAdmin = false) {
    const data = xlsx.utils.sheet_to_json(worksheet);
    const users = [];
    
    for (const row of data) {
        const fullName = `${row['First Name'] || row['Name'] || ''} ${row['Last Name'] || ''}`.trim();
        const email = (row['Email'] || '').trim().toLowerCase();
        const code = (row['Code'] || '').trim();
        
        if (!code) {
            console.warn(`Skipping user ${fullName} - no code provided`);
            continue;
        }
        
        // Use code as both verification code and password
        const hashedPassword = await hashPassword(code);
        
        users.push({
            name: fullName,
            email: email || `${code.toLowerCase()}@matricassassin.com`,
            username: code.toLowerCase(),
            verificationCode: code,
            password: hashedPassword,
            isAdmin: isAdmin,
            status: 'active',
            targetName: row['Target'] || ''
        });
    }
    
    return users;
}

async function importData() {
    try {
        // Read the Excel file
        const filePath = path.join(__dirname, '../../Matric Assassin Database.xlsx');
        console.log(`Reading Excel file from: ${filePath}`);
        
        if (!fs.existsSync(filePath)) {
            throw new Error(`Excel file not found at: ${filePath}`);
        }
        
        const workbook = xlsx.readFile(filePath);
        
        // Process Players sheet
        const playersSheet = workbook.Sheets['Players'];
        if (!playersSheet) throw new Error('Players sheet not found in Excel file');
        const players = await processSheet(playersSheet, false);
        
        // Process Admins sheet if it exists
        let admins = [];
        if (workbook.SheetNames.includes('Admins')) {
            const adminsSheet = workbook.Sheets['Admins'];
            admins = await processSheet(adminsSheet, true);
        } else {
            console.log('No Admins sheet found, importing players only');
        }
        
        // Combine all users
        const allUsers = [...players, ...admins];
        
        // Clear existing users
        await User.deleteMany({});
        
        // Insert new users
        const result = await User.insertMany(allUsers);
        console.log(`Successfully imported ${result.length} users (${players.length} players, ${admins.length} admins)`);
        
        // Update targets in a separate step after all users are created
        const nameToIdMap = new Map(result.map(u => [u.name, u._id]));
        let targetsUpdated = 0;
        
        for (const user of result) {
            if (user.targetName) {
                const targetId = nameToIdMap.get(user.targetName);
                if (targetId) {
                    await User.updateOne(
                        { _id: user._id },
                        { $set: { target: targetId } }
                    );
                    targetsUpdated++;
                } else {
                    console.warn(`Target not found for ${user.name}: ${user.targetName}`);
                }
            }
        }
        
        console.log(`Successfully updated ${targetsUpdated} targets`);
        console.log('\n=== IMPORT COMPLETE ===');
        console.log('Users can log in with:');
        console.log('- Username: their unique code');
        console.log('- Password: their unique code');
        
        process.exit(0);
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
}
