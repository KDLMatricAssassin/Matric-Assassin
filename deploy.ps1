# Create docs directory if it doesn't exist
if (-not (Test-Path -Path "docs")) {
    New-Item -ItemType Directory -Path "docs"
}

# Copy necessary files to docs directory
$filesToCopy = @(
    "index.html",
    "app.js",
    "styles.css",
    "*.jpg",
    "*.png"
)

foreach ($file in $filesToCopy) {
    if (Test-Path $file) {
        Copy-Item -Path $file -Destination "docs\" -Recurse -Force
    }
}

# Create a simple server.js for GitHub Pages
@'
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
'@ | Out-File -FilePath "docs\server.js" -Encoding utf8

Write-Host "Deployment files have been prepared in the 'docs' directory."
Write-Host "To deploy to GitHub Pages:"
Write-Host "1. Commit and push the 'docs' folder to your repository"
Write-Host "2. Go to repository Settings > Pages"
Write-Host "3. Set source to 'Deploy from a branch' and select 'main' branch and '/docs' folder"
