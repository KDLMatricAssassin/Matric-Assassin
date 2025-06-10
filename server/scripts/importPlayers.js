require('dotenv').config();
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Player = require('../models/Player');
const Game = require('../models/Game');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/senior-assassin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Parse command line arguments
const args = process.argv.slice(2);
const filePath = args[0];
const gameName = args[1] || 'Senior Assassin 2025';

if (!filePath) {
  console.error('Please provide the path to the Excel file');
  console.log('Usage: node importPlayers.js <path-to-excel> [game-name]');
  process.exit(1);
}

// Function to parse the Excel file
async function parseExcelAndImport(filePath, gameName) {
  try {
    // Read the Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Create a new game
    const game = new Game({
      name: gameName,
      status: 'active',
      createdBy: new mongoose.Types.ObjectId(), // This will be replaced with admin user ID
    });
    
    await game.save();
    console.log(`Created game: ${game.name} (${game._id})`);
    
    // Create a map to store players by name for target assignment
    const playerMap = new Map();
    const players = [];
    
    // First pass: create all players
    for (const row of data) {
      if (!row[0] || !row[1]) continue; // Skip empty rows
      
      const [name, code] = row[0].split(' -> ');
      const uniqueCode = row[1];
      
      if (!name || !uniqueCode) continue;
      
      const player = new Player({
        name: name.trim(),
        email: `${name.trim().toLowerCase().replace(/\s+/g, '.')}@kdl.com`,
        verificationCode: uniqueCode.trim(),
        status: 'active',
        game: game._id,
      });
      
      playerMap.set(name.trim(), player);
      players.push({
        player,
        targetName: row[0].split(' -> ')[1]?.trim()
      });
      
      console.log(`Prepared player: ${player.name} (${player.verificationCode})`);
    }
    
    // Save all players to get their IDs
    await Promise.all(players.map(p => p.player.save()));
    console.log('Saved all players to database');
    
    // Second pass: assign targets
    for (const { player, targetName } of players) {
      if (targetName) {
        const targetPlayer = playerMap.get(targetName);
        if (targetPlayer) {
          player.target = targetPlayer._id;
          targetPlayer.hunter = player._id;
          await Promise.all([player.save(), targetPlayer.save()]);
          console.log(`Assigned target: ${player.name} -> ${targetPlayer.name}`);
        } else {
          console.warn(`Target not found: ${targetName} for player ${player.name}`);
        }
      }
    }
    
    console.log('\nImport completed successfully!');
    console.log(`Game ID: ${game._id}`);
    console.log(`Total players imported: ${players.length}`);
    
  } catch (error) {
    console.error('Error importing players:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the import
parseExcelAndImport(filePath, gameName);
