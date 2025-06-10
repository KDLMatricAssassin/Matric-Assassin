# Player Import Script

This script imports players from an Excel file into the Senior Assassin game database.

## Excel File Format

Your Excel file should have the following format:

| Column A | Column B |
|----------|----------|
| Player Name -> Target Name | Unique Code |
| John Doe -> Jane Smith | ABC123 |
| Jane Smith -> Bob Johnson | DEF456 |
| ... | ... |

## Prerequisites

1. Node.js installed
2. MongoDB running locally or connection string in .env
3. Excel file with player data

## Setup

1. Install dependencies:
   ```bash
   cd server/scripts
   npm install
   ```

2. Create a `.env` file in the `server` directory with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/senior-assassin
   ```

## Usage

Run the import script with the path to your Excel file:

```bash
node importPlayers.js path/to/your/excel.xlsx "Game Name"
```

Example:
```bash
node importPlayers.js "C:\Users\YourName\players.xlsx" "KDL Matric Assassin 2025"
```

## Output

The script will:
1. Create a new game
2. Import all players with their verification codes
3. Set up target assignments
4. Print a summary of the import

## Notes

- Player emails will be auto-generated in the format: firstname.lastname@kdl.com
- Each player will be assigned a unique verification code from your Excel file
- The script will automatically set up the target assignments based on the "->" notation in your Excel file
