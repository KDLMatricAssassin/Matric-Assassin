// Simple server for GitHub Pages
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the 'docs' directory
app.use(express.static(path.join(__dirname, 'docs')));

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
