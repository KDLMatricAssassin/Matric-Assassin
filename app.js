// Game Data
const gameData = {
    players: [],
    admins: [
        { name: 'Main Admin', code: 'ADMIN123' },
        { name: 'Gadi Crouse', code: 'GADI2025' },
        { name: 'Tana Lyons', code: 'TANA2025' },
        { name: 'Tevin Stoch', code: 'TEVIN2025' },
        { name: 'Ethan Atie', code: 'ETHAN2025' }
    ],
    currentUser: null,
    gameStatus: 'not_started', // Game starts as not started
    posts: [],
    pendingApprovals: {
        posts: [] // Removed profilePics since no approval needed
    }
};

// Function to initialize game data with player information
function initializeGameData() {
    // Clear existing data
    gameData.players = [];
    
    // Player data in the format: Player Name -> Target Name | Code
    const playerData = `
        Leora Joffe --> Amy Moritz\t4J2Y2H
        Amy Moritz --> Lia Levy\t0L5FUM
        Lia Levy --> Sasha Rubenstein\t178ZY0
        Sasha Rubenstein --> Sam Joffe\tPQK6E2
        Sam Joffe --> Leor Friedman\t2Y53TN
        Leor Friedman --> Leora Boner\tLD3BIX
        Leora Boner --> Tali Smith\tH1X9M2
        Josh Bayhack --> Chad Goldberg\tVQAF9T
        Chad Goldberg --> Tyron Lasovsky\tMMRF4N
        Tyron Lasovsky --> Josh Bayhack\tDD2ZOV
        Tali Smith --> Alex Hirshowitz\t4G31PT
        Alex Hirshowitz --> Ella Barnett\tJXR0HD
        Ella Barnett --> Harvey Joshua\tZ5DKJ5
        Harvey Joshua --> Jamie Kissos\tNKJA87
        Jamie Kissos --> Seth Sklar\tSGRKSN
        Levi Raff --> Gideon Bloom\tAVZQTV
        Gideon Bloom --> Joshua Galgut\tQTUVNO
        Joshua Galgut --> Adam Lyons\tQ6HRW9
        Adam Lyons --> Tali Sack\tTFHSZ1
        Tali Sack --> Dinah Worms\tLENR3V
        Dinah Worms --> Eitan Greenblatt\tZT6I0K
        Eitan Greenblatt --> Jaime Diamond\t89GEU2
        Jaime Diamond --> Sara Joffe\tO2SWTR
        Sara Joffe --> Tayla Cohen\tN20XJZ
        Tayla Cohen --> Aviva Samuels\tJRB3V5
        Aviva Samuels --> Cody Hirschman\tK5PVFA
        Cody Hirschman --> Raz Oudmayer\t133GCW
        Raz Oudmayer --> Mischa Suchard\tR5T8SU
        Mischa Suchard --> Amelie Hirshowitz\tSX10HP
        Amelie Hirshowitz --> Eliana Mervis\tGLUY05
        Eliana Mervis --> Daniel Waisman\tFN8I2L
        Daniel Waisman --> Adam Gratch\tKIIAMI
        Adam Gratch --> Hannah Camberg\t9910Y6
        Hannah Camberg --> Ella Gingell\t8CVIR8
        Ella Gingell --> Jamie Jackson\tXU6OG6
        Jamie Jackson --> Lily-Rose Brenner\t47W0WX
        Lily-Rose Brenner --> Emily Joffe\t06BJMJ
        Emily Joffe --> Rebbeca Jellin\t9QGFL4
        Rebbeca Jellin --> Mika Sacharowitz\t6MZSHY
        Mika Sacharowitz --> Sabrina Cohen\t0DE5TC
        Sabrina Cohen --> Jayce Katz\tSCISHH
        Jayce Katz --> Tyla Rothstein\tXW1OM0
        Tyla Rothstein --> Doron Sandler\t0JPU31
        Doron Sandler --> Gabriel Boyer\t12BFEX
        Ben Levin --> Jadon Banfield\tXTMN4A
        Jadon Banfield --> Eden Lyons\tS31WNM
        Eden Lyons --> Jacob Maloon\tG93OWT
        Jacob Maloon --> Aidan Cohen\tP2C2MO
        Aidan Cohen --> Sam Gewer\t53EA5P
        Sam Gewer --> Levi Raff\tXLETPI
        Seth Sklar --> Sage Klug\tVE8T33
        Sage Klug --> Lindy Kolman\tWPD7IS
        Lindy Kolman --> Zach Karan\tEOXN5Q
        Zach Karan --> Jayden Sacker\t981HWC
        Dakota Trakman --> Madison Williams\tQXCI4Y
        Madison Williams --> Savanna Shortridge\t8SHI3Z
        Savanna Shortridge --> Ella Lewis\tU1HW8O
        Ella Lewis --> Alexa Reubenson\tQM9Z8A
        Alexa Reubenson --> Gabi Baily\tQ1359M
        Gabi Baily --> Mia Jacobson\t7RG1UX
        Demi Wulfsohn --> Ben Levin\tHHC4I2
        Gabriel Boyer --> Jessica Sack\t744X3N
        Jessica Sack --> Gabi Romberg\tYB7LAD
        Gabi Romberg --> Yael Yanai\t50HC4Z
        Yael Yanai --> Yotam Limor\tUCJMV6
        Yotam Limor --> SJ Makgalemele\tJDHLLE
        SJ Makgalemele --> Sam Kallner\tG2UR1O
        Sam Kallner --> Sarah Kahanowitz\tPLJF5O
        Sarah Kahanowitz --> Noa Herring\t4OERAC
        Noa Herring --> Adam Schlosberg\t88TVCC
        Adam Schlosberg --> Jamie Defries\t9V65YO
        Jamie Defries --> Lexi Silverman\tWJ8GNH
        Lexi Silverman --> Cameron Lyons\t3WL5HW
        Cameron Lyons --> Alissa Kirkle\t380QA2
        Alissa Kirkle --> Dunn Klaff\tHM0FJL
        Dunn Klaff --> Sasha Gordon\t0QWEB2
        Sasha Gordon --> Leah Joss\t22TY97
        Leah Joss --> Gila Smith\tQLQL31
        Gila Smith --> Kiara Cohen\tMDFAB2
        Kiara Cohen --> Ethan Lunt\tAF0HJW
        Ethan Lunt --> Cammi Dorfman\t6PFFSA
        Cammi Dorfman --> Tayla Smith\t9ZPS3C
        Jordan Ribeiro --> Jesse Silber\t15AJ28
        Jesse Silber --> Mika Fanaroff\tJRKL3S
        Mika Fanaroff --> Demi Lurie\tYUYCGX
        Demi Lurie --> Eli Kagan\tWY7YKG
        Eli Kagan --> Jordan Ribeiro\tXLDFHS
        Jayden Sacker --> Jessica Woznica\tLZLI9V
        Jessica Woznica --> Rory Pai\t2NKJ86
        Rory Pai --> Brad Shill\tQL946W
        Brad Shill --> Erin Dworkin\tMH6UHT
        Erin Dworkin --> Hannah Duchan\t2TCGEU
        Hannah Duchan --> Hannah Gordon\t59PT7H
        Hannah Gordon --> Benji Furman\t20RXOQ
        Benji Furman --> Gabi Camberg\t4MO2UJ
        Gabi Camberg --> Teagan Goldsmith\tAFWWMH
        Teagan Goldsmith --> Demi Toker\tHHVU6V
        Demi Toker --> Tyra Kuper\t7PFRLH
        Tyra Kuper --> Demi Wulfsohn\t2ZQ2Q8
        Mia Jacobson --> Lexi Fine\t9TAPCH
        Lexi Fine --> Ella Solomon\t7W6AIY
        Ella Solomon --> Gaby Shankman\t952SOV
        Gaby Shankman --> Sierra Sher\t7615DY
        Sierra Sher --> Jami Levin\tSATV9T
        Jami Levin --> Sarah Alexander\tI6G657
        Sarah Alexander --> Jordana Sundelson\tP9J0W4
        Jordana Sundelson --> Bailey Lipworth\tFG85RS
        Bailey Lipworth --> Leah Kerr-Phillips\tW92ATY
        Leah Kerr-Phillips --> Dakota Trakman\t2HE5XC
        Tayla Smith --> Amber Freidlein\t0IRSI8
        Amber Freidlein --> Cody Lipworth\tISTIIZ
        Cody Lipworth --> David Levitt\tUIDOZ2
        David Levitt --> Michael Markowitz\tHU9MTQ
        Michael Markowitz --> Sian Temkin\tX7G4R9
        Sian Temkin --> Juliana Hirsch\tQ2J8D1
        Juliana Hirsch --> Eden Dworcan\tB5Z3T4
        Eden Dworcan --> Hannah Benson\tF7B2X1
        Adam Gordon --> Sienna Silberman\tF4TG9S
        Sienna Silberman --> Ben Meltzer\tPK3DR9
        Ben Meltzer --> Tyler Cimring\tJ8GF4D
        Ari Symons --> Adam Gordon\tH5NM2X
        Tyler Cimring --> Jacob Defries\tX7L9QM
        Jacob Defries --> Adam Goldberg\tD3TZV5
        Hannah Benson --> Ari Symons\tL81RKU
        Adam Goldberg --> Leora Joffe\t3A5GQU
    `;

    // Process player data
    const playerMap = new Map();
    const playerList = [];
    let id = 1;

    // First pass: create all players
    playerData.trim().split('\n').forEach(line => {
        const [playerPart, code] = line.trim().split('\t');
        const [playerName, targetName] = playerPart.split('-->').map(s => s.trim());
        
        if (playerName && code) {
            const player = {
                _id: String(id++),
                name: playerName,
                verificationCode: code.trim(),
                target: null, // Will be set in second pass
                status: 'active',
                eliminations: 0,
                image: null, // No default profile picture
                email: `${playerName.toLowerCase().replace(/\s+/g, '.')}@kdl.com`,
                profilePicApproved: false
            };
            
            playerMap.set(playerName, { player, targetName });
            playerList.push(player);
        }
    });

    // Second pass: set targets
    playerList.forEach(player => {
        const playerInfo = playerMap.get(player.name);
        if (playerInfo) {
            const targetInfo = playerMap.get(playerInfo.targetName);
            if (targetInfo) {
                player.target = targetInfo.player._id;
            }
        }
    });

    // Add players to game data
    gameData.players = playerList;

    // Start with no posts
    gameData.posts = [];
}

// Helper function to get a random avatar image
function getRandomAvatar() {
    const gender = Math.random() > 0.5 ? 'men' : 'women';
    const id = Math.floor(Math.random() * 100);
    return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
}

// Track target history for each player
function initializeTargetHistory() {
    gameData.players.forEach(player => {
        if (!player.targetHistory) {
            player.targetHistory = [];
        }
    });
}

// Helper function to ensure gameData has required structures
function ensureGameDataStructures() {
    if (!gameData.pendingApprovals) {
        gameData.pendingApprovals = { posts: [] };
    }
    if (!gameData.posts) {
        gameData.posts = [];
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ensureGameDataStructures();
    init();
    initAdminSearch();
    renderPendingPosts();
    renderApprovedPosts();
    
    // Add event listener for tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabId = e.target.getAttribute('data-tab');
            // Update active tab
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Show the selected tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
            });
            document.getElementById(tabId).style.display = 'block';
            
            // Update the content if needed
            if (tabId === 'posts-tab') {
                renderPendingPosts();
                renderApprovedPosts();
            } else if (tabId === 'players-tab') {
                renderPlayersList();
            }
        });
    });
});

// Show targets view
function showTargets() {
    document.getElementById('app').style.display = 'none';
    const targetsView = document.getElementById('targets-view');
    targetsView.style.display = 'block';
    renderTargetsView();
}

// Hide targets view
function hideTargets() {
    document.getElementById('targets-view').style.display = 'none';
    document.getElementById('app').style.display = 'block';
}

// Render the targets view
function renderTargetsView() {
    const currentTargetEl = document.getElementById('current-target');
    const previousTargetsEl = document.getElementById('previous-targets');
    
    // Show loading state
    if (currentTargetEl) {
        currentTargetEl.innerHTML = `
            <div class="target-loading">
                <i class="fas fa-spinner fa-spin"></i> Loading target...
            </div>
        `;
    }
    
    if (previousTargetsEl) {
        previousTargetsEl.innerHTML = `
            <div class="target-loading">
                <i class="fas fa-spinner fa-spin"></i> Loading history...
            </div>
        `;
    }
    
    // Ensure game data is loaded
    if (!gameData || !gameData.players || !gameData.currentUser) {
        console.error('Game data not properly initialized');
        if (currentTargetEl) {
            currentTargetEl.innerHTML = `
                <div class="no-targets">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error loading game data</p>
                    <small>Please refresh the page and try again</small>
                </div>
            `;
        }
        return;
    }
    
    const currentUser = gameData.players.find(p => p._id === gameData.currentUser);
    if (!currentUser) {
        console.error('Current user not found');
        if (currentTargetEl) {
            currentTargetEl.innerHTML = `
                <div class="no-targets">
                    <i class="fas fa-user-slash"></i>
                    <p>User not found</p>
                    <small>Please log in again</small>
                </div>
            `;
        }
        return;
    }
    
    // Render the actual content
    renderCurrentTarget(currentUser);
    renderPreviousTargets(currentUser);
}

// Render current target
function renderCurrentTarget(currentUser) {
    const currentTargetEl = document.getElementById('current-target');
    if (!currentTargetEl) return;
    
    // Clear previous content and show loading state
    currentTargetEl.innerHTML = `
        <div class="target-loading">
            <i class="fas fa-spinner fa-spin"></i> Loading target...
        </div>
    `;
    
    // If user is eliminated, show eliminated message
    if (currentUser.status === 'eliminated') {
        currentTargetEl.innerHTML = `
            <div class="no-targets">
                <i class="fas fa-skull"></i>
                <p>You have been eliminated</p>
                <small>You cannot see your target anymore</small>
            </div>
        `;
        return;
    }
    
    // If no target, show message
    if (!currentUser.target) {
        currentTargetEl.innerHTML = `
            <div class="no-targets">
                <i class="fas fa-bullseye"></i>
                <p>No current target</p>
                <small>You don't have an active target at the moment</small>
            </div>
        `;
        return;
    }
    
    // Find the target player
    const target = findPlayerById(currentUser.target);
    
    // If target not found, show error
    if (!target) {
        console.error(`Target not found for user ${currentUser._id}`);
        currentTargetEl.innerHTML = `
            <div class="no-targets">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Target Error</p>
                <small>Could not find your target. Please contact admin.</small>
            </div>
        `;
        return;
    }
    
    // If target is eliminated, show message and try to find next target
    if (target.status === 'eliminated') {
        // Check if we should inherit the target's target
        if (target.target) {
            const nextTarget = findPlayerById(target.target);
            if (nextTarget && nextTarget.status === 'active') {
                // Update current user's target to the next target
                currentUser.target = target.target;
                // Re-render with new target
                renderCurrentTarget(currentUser);
                return;
            }
        }
        
        // If no valid next target, show eliminated message
        currentTargetEl.innerHTML = `
            <div class="no-targets">
                <i class="fas fa-skull"></i>
                <p>Target Eliminated</p>
                <small>Your target has been eliminated. Waiting for reassignment.</small>
            </div>
        `;
        return;
    }
    
    // All good, show the target
    const targetStatus = target.status === 'eliminated' ? 'Eliminated' : 'Active';
    const statusClass = target.status === 'eliminated' ? 'status-eliminated' : 'status-active';
    const kills = target.eliminations || 0;
    
    currentTargetEl.innerHTML = `
        <div class="target-card">
            <div class="target-info">
                <div class="target-avatar">
                    ${target.image ? 
                        `<img src="${target.image}" alt="${target.name}" onerror="this.onerror=null; this.parentElement.innerHTML='<i class=\'fas fa-user\'></i>'">` : 
                        `<i class="fas fa-user"></i>`
                    }
                </div>
                <div class="target-details">
                    <h3>${target.name || 'Unknown Player'}</h3>
                    <div class="target-meta">
                        <span class="target-status ${statusClass}">${targetStatus}</span>
                        <span><i class="fas fa-crosshairs"></i> ${kills} ${kills === 1 ? 'Kill' : 'Kills'}</span>
                        ${target.code ? `<span><i class="fas fa-id-card"></i> ${target.code}</span>` : ''}
                    </div>
                </div>
            </div>
            ${target.notes ? `<div class="target-notes"><p>${target.notes}</p></div>` : ''}
        </div>
    `;
}

// Render previous targets
function renderPreviousTargets(currentUser) {
    const previousTargetsEl = document.getElementById('previous-targets');
    if (!previousTargetsEl) return;
    
    // Get all previous targets from targetHistory
    const previousTargets = currentUser.targetHistory 
        ? currentUser.targetHistory.map(entry => ({
            ...entry,
            target: gameData.players.find(p => p._id === entry.targetId)
        })).filter(entry => entry.target) // Filter out any invalid targets
        : [];
    
    if (previousTargets.length === 0) {
        previousTargetsEl.innerHTML = `
            <div class="no-targets">
                <i class="fas fa-inbox"></i>
                <p>No previous targets yet</p>
                <small>Your previous targets will appear here</small>
            </div>
        `;
        return;
    }
    
    previousTargetsEl.innerHTML = previousTargets.map(entry => {
        const target = entry.target;
        const eliminationDate = entry.eliminatedAt ? new Date(entry.eliminatedAt).toLocaleDateString() : 'N/A';
        
        return `
            <div class="target-card">
                <div class="target-info">
                    <div class="target-avatar">
                        ${target.image ? 
                            `<img src="${target.image}" alt="${target.name}">` : 
                            `<i class="fas fa-user"></i>`
                        }
                    </div>
                    <div class="target-details">
                        <h3>${target.name}</h3>
                        <div class="target-meta">
                            <span class="target-status status-eliminated">Eliminated</span>
                            <span><i class="fas fa-crosshairs"></i> ${target.eliminations || 0} Kills</span>
                            <span><i class="fas fa-calendar"></i> ${eliminationDate}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Update target history when a player is eliminated
function updateTargetHistory(eliminatedPlayerId, eliminatedBy) {
    const hunter = gameData.players.find(p => p._id === eliminatedBy);
    if (!hunter) return;
    
    // Add to hunter's target history
    hunter.targetHistory = hunter.targetHistory || [];
    hunter.targetHistory.push({
        targetId: eliminatedPlayerId,
        eliminatedAt: new Date().toISOString()
    });
    
    // Save to localStorage
    saveToLocalStorage();
}

// Initialize game data when the script loads
initializeGameData();
initializeTargetHistory();

// Helper function to find player by verification code
function findPlayerByVerificationCode(code) {
    return gameData.players.find(p => p.verificationCode === code);
}

// Helper function to find player by ID
function findPlayerById(id) {
    return gameData.players.find(player => player._id === id);
}

// Handle profile picture upload
function handleProfilePictureUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageUrl = e.target.result;
        
        // Update the current user's profile picture
        if (gameData.currentUser) {
            gameData.currentUser.image = imageUrl;
            
            // Update in the players array
            const playerIndex = gameData.players.findIndex(p => p._id === gameData.currentUser._id);
            if (playerIndex !== -1) {
                gameData.players[playerIndex].image = imageUrl;
            }
            
            // Update the UI
            updateProfilePicture(imageUrl);
            
            // Save to localStorage
            saveToLocalStorage();
        }
    };
    
    reader.readAsDataURL(file);
}

// Update the profile picture in the UI
function updateProfilePicture(imageUrl) {
    const profileAvatar = document.getElementById('profile-avatar');
    if (!profileAvatar) return;
    
    // Remove any existing image
    const existingImg = profileAvatar.querySelector('img');
    if (existingImg) {
        existingImg.src = imageUrl;
        return;
    }
    
    // Remove the icon if it exists
    const icon = profileAvatar.querySelector('i');
    if (icon) {
        profileAvatar.removeChild(icon);
    }
    
    // Create and append the new image
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Profile';
    profileAvatar.appendChild(img);
}

// Save data to localStorage
function saveToLocalStorage() {
    try {
        const dataToSave = {
            ...gameData,
            // Don't save pending approvals to localStorage
            pendingApprovals: {
                posts: []
            }
        };
        localStorage.setItem('assassinGameData', JSON.stringify(dataToSave));
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

// Submit a new post for approval
function submitPostForApproval(postData) {
    if (!gameData.pendingApprovals.posts) {
        gameData.pendingApprovals.posts = [];
    }
    
    const post = {
        id: Date.now().toString(),
        ...postData,
        status: 'pending',
        timestamp: new Date().toISOString(),
        approvedBy: null,
        approvedAt: null
    };
    
    gameData.pendingApprovals.posts.push(post);
    renderPendingPosts();
    return post;
}

// Approve a post
function approvePost(postId) {
    const pendingPosts = gameData.pendingApprovals.posts || [];
    const postIndex = pendingPosts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) return false;
    
    const post = pendingPosts[postIndex];
    post.status = 'approved';
    post.approvedBy = 'admin'; // In a real app, this would be the admin's ID
    post.approvedAt = new Date().toISOString();
    
    // Move to approved posts
    if (!gameData.posts) gameData.posts = [];
    gameData.posts.unshift(post);
    
    // Remove from pending
    gameData.pendingApprovals.posts.splice(postIndex, 1);
    
    // Update UI
    renderPendingPosts();
    renderApprovedPosts();
    saveToLocalStorage();
    
    return true;
}

// Reject a post
function rejectPost(postId) {
    const pendingPosts = gameData.pendingApprovals.posts || [];
    const postIndex = pendingPosts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) return false;
    
    // In a real app, you might want to store rejected posts or notify the user
    gameData.pendingApprovals.posts.splice(postIndex, 1);
    
    renderPendingPosts();
    saveToLocalStorage();
    
    return true;
}

// Delete an approved post
function deletePost(postId) {
    if (!gameData.posts) return false;
    
    const postIndex = gameData.posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return false;
    
    gameData.posts.splice(postIndex, 1);
    
    renderApprovedPosts();
    saveToLocalStorage();
    
    return true;
}

// Render pending posts
function renderPendingPosts() {
    const container = document.getElementById('pending-posts-list');
    if (!container) return;
    
    const pendingPosts = gameData.pendingApprovals.posts || [];
    
    if (pendingPosts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <p>No pending posts to approve</p>
            </div>`;
        return;
    }
    
    container.innerHTML = pendingPosts.map(post => `
        <div class="post-card pending">
            <div class="post-header">
                <span class="post-user">${post.userName || 'Anonymous'}</span>
                <span class="post-time">${formatTimeAgo(post.timestamp)}</span>
            </div>
            ${post.content ? `<div class="post-content">${post.content}</div>` : ''}
            ${post.imageUrl ? `<img src="${post.imageUrl}" class="post-image" alt="Post image">` : ''}
            <div class="post-actions">
                <button class="btn-approve" onclick="approvePost('${post.id}')">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="btn-reject" onclick="rejectPost('${post.id}')">
                    <i class="fas fa-times"></i> Reject
                </button>
            </div>
        </div>
    `).join('');
}

// Render approved posts
function renderApprovedPosts() {
    const container = document.getElementById('approved-posts-list');
    if (!container) return;
    
    const approvedPosts = gameData.posts || [];
    const recentPosts = approvedPosts.slice(0, 10); // Show only 10 most recent
    
    if (recentPosts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <p>No recently approved posts</p>
            </div>`;
        return;
    }
    
    container.innerHTML = recentPosts.map(post => `
        <div class="post-card approved">
            <div class="post-header">
                <span class="post-user">${post.userName || 'Anonymous'}</span>
                <span class="post-time">${formatTimeAgo(post.timestamp)} • Approved</span>
            </div>
            ${post.content ? `<div class="post-content">${post.content}</div>` : ''}
            ${post.imageUrl ? `<img src="${post.imageUrl}" class="post-image" alt="Post image">` : ''}
            <div class="post-actions">
                <button class="btn-delete" onclick="deletePost('${post.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Helper function to format time
function formatTimeAgo(timestamp) {
    if (!timestamp) return 'Just now';
    
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + ' year' + (interval === 1 ? '' : 's') + ' ago';
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + ' month' + (interval === 1 ? '' : 's') + ' ago';
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + ' day' + (interval === 1 ? '' : 's') + ' ago';
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + ' hour' + (interval === 1 ? '' : 's') + ' ago';
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + ' minute' + (interval === 1 ? '' : 's') + ' ago';
    
    return 'Just now';
}

// Make functions available globally
window.approvePost = approvePost;
window.rejectPost = rejectPost;
window.deletePost = deletePost;
window.submitPostForApproval = submitPostForApproval;

// Show full leaderboard view
function showLeaderboard() {
    document.getElementById('app').style.display = 'none';
    document.getElementById('targets-view').style.display = 'none';
    const leaderboardView = document.getElementById('leaderboard-view');
    leaderboardView.style.display = 'block';
    renderFullLeaderboard();
    initSortableHeaders();
}

// Show targets view
function showTargets() {
    document.getElementById('app').style.display = 'none';
    document.getElementById('leaderboard-view').style.display = 'none';
    const targetsView = document.getElementById('targets-view');
    targetsView.style.display = 'block';
    
    // Load and display the current user's target information
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        console.error('No user is currently logged in');
        return;
    }
    
    // Find the current user in gameData to get their target
    const player = gameData.players.find(p => p._id === currentUser._id);
    const currentTargetContainer = document.getElementById('current-target');
    
    console.log('Current User:', currentUser);
    console.log('Player Data:', player);
    console.log('All Players:', gameData.players);
    
    if (!player) {
        console.error('Player not found in gameData');
        currentTargetContainer.innerHTML = `
            <div class="no-targets">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Player data not found</p>
            </div>
        `;
        return;
    }
    
    if (!player.target) {
        currentTargetContainer.innerHTML = `
            <div class="no-targets">
                <i class="fas fa-bullseye"></i>
                <p>No current target assigned</p>
                <small>Check back later or contact an admin</small>
            </div>
        `;
    } else {
        console.log('Current Target ID:', player.target);
        const target = gameData.players.find(p => p._id === player.target);
        console.log('Found Target:', target);
        if (target) {
            currentTargetContainer.innerHTML = `
                <div class="target-info">
                    <div class="target-avatar">
                        ${target.image ? 
                            `<img src="${target.image}" alt="${target.name}">` : 
                            `<i class="fas fa-user"></i>`
                        }
                    </div>
                    <div class="target-details">
                        <h3>${target.name}</h3>
                        <div class="target-meta">
                            <span class="status-badge status-${target.status || 'active'}">
                                ${target.status === 'eliminated' ? 'Eliminated' : 'Active'}
                            </span>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    // Load previous targets if any
    const previousTargetsContainer = document.getElementById('previous-targets');
    if (player.previousTargets && player.previousTargets.length > 0) {
        const previousTargetsHTML = player.previousTargets.map(targetId => {
            const target = gameData.players.find(p => p._id === targetId);
            if (!target) return '';
            return `
                <div class="target-card">
                    <div class="target-info">
                        <div class="target-avatar">
                            ${target.image ? 
                                `<img src="${target.image}" alt="${target.name}">` : 
                                `<i class="fas fa-user"></i>`
                            }
                        </div>
                        <div class="target-details">
                            <h3>${target.name}</h3>
                            <div class="target-meta">
                                <span class="status-badge status-eliminated">Eliminated</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        previousTargetsContainer.innerHTML = previousTargetsHTML;
    } else {
        previousTargetsContainer.innerHTML = `
            <div class="no-targets">
                <i class="fas fa-inbox"></i>
                <p>No previous targets yet</p>
            </div>
        `;
    }
}

// Hide targets view
function hideTargets() {
    document.getElementById('targets-view').style.display = 'none';
    document.getElementById('app').style.display = 'block';
}

// Hide leaderboard view and return to app
function hideLeaderboard() {
    document.getElementById('leaderboard-view').style.display = 'none';
    document.getElementById('app').style.display = 'block';
}

// Update sort indicators in the UI
function updateSortIndicators(field) {
    // Remove all sort classes
    document.querySelectorAll('.sortable').forEach(header => {
        header.classList.remove('asc', 'desc');
        const icon = header.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-sort';
        }
    });

    // Add sort class to current field
    const currentHeader = document.querySelector(`.sortable[data-sort="${field}"]`);
    if (currentHeader) {
        const icon = currentHeader.querySelector('i');
        if (icon) {
            const sortIcon = sortConfig.direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
            icon.className = `fas ${sortIcon}`;
        }
        currentHeader.classList.add(sortConfig.direction);
    }
}

// Handle header click for sorting
function handleHeaderClick(event) {
    const header = event.target.closest('.sortable');
    if (!header) return;
    
    const field = header.dataset.sort;
    if (!field) return;
    
    // Toggle direction if clicking the same field
    if (sortConfig.field === field) {
        sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
        // Default to ascending for new field
        sortConfig.field = field;
        sortConfig.direction = 'asc';
    }
    
    updateSortIndicators(field);
    renderFullLeaderboard();
}

// Initialize sortable headers
function initSortableHeaders() {
    document.querySelectorAll('.leaderboard-header-row .sortable').forEach(header => {
        header.addEventListener('click', handleHeaderClick);
    });
    updateSortIndicators(sortConfig.field);
}

// Render full leaderboard with all players
function renderFullLeaderboard() {
    const leaderboardEntries = document.getElementById('leaderboard-entries');
    if (!leaderboardEntries) return;
    
    const players = getLeaderboardPlayers();
    
    if (players.length === 0) {
        leaderboardEntries.innerHTML = `
            <div class="empty-leaderboard">
                <i class="fas fa-users"></i>
                <p>No players found</p>
            </div>
        `;
        return;
    }
    
    let leaderboardHTML = '';
    
    players.forEach((player, index) => {
        const isCurrentUser = gameData.currentUser && gameData.currentUser._id === player._id;
        const rowClass = isCurrentUser ? 'current-user' : '';
        
        leaderboardHTML += `
            <div class="leaderboard-entry ${rowClass}">
                <div class="rank-col">#${index + 1}</div>
                <div class="player-col">
                    <div class="player-avatar">
                        ${player.image ? 
                            `<img src="${player.image}" alt="${player.name}">` : 
                            `<i class="fas fa-user"></i>`
                        }
                    </div>
                    <span class="player-name">${player.name} ${isCurrentUser ? '(You)' : ''}</span>
                </div>
                <div class="kills-col">${player.eliminations || 0}</div>
                <div class="status-col">
                    <span class="status-badge status-${player.status || 'active'}">
                        ${player.status === 'eliminated' ? 'Eliminated' : 'Active'}
                    </span>
                </div>
            </div>
        `;
    });
    
    leaderboardEntries.innerHTML = leaderboardHTML;
}

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const app = document.getElementById('app');
const playerCodeInput = document.getElementById('player-code');
const loginBtn = document.getElementById('login-btn');
const adminLoginBtn = document.getElementById('admin-login-btn');
const logoutBtn = document.getElementById('logout-btn');
const adminPanelToggle = document.getElementById('admin-panel-toggle');
const adminPanel = document.getElementById('admin-panel');
const closeAdminPanel = document.getElementById('close-admin-panel');
const playerNameEl = document.getElementById('player-name');
const playerStatusEl = document.getElementById('player-status');
const targetNameEl = document.getElementById('target-name');
const activePlayersEl = document.getElementById('active-players');
const eliminatedPlayersEl = document.getElementById('eliminated-players');
const daysLeftEl = document.getElementById('days-left');
const postsContainer = document.getElementById('posts-container');
const playersList = document.getElementById('players-list');
const pendingEliminations = document.getElementById('pending-eliminations');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Initialize the app
function init() {
    // Event Listeners
    loginBtn.addEventListener('click', handleLogin);
    adminLoginBtn.addEventListener('click', showAdminLogin);
    logoutBtn.addEventListener('click', handleLogout);
    adminPanelToggle.addEventListener('click', toggleAdminPanel);
    closeAdminPanel.addEventListener('click', toggleAdminPanel);
    document.addEventListener('click', handleOutsideClick);
    
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', switchTab);
    });
    
    // Initialize profile picture upload
    const profilePicUpload = document.getElementById('profile-picture-upload');
    if (profilePicUpload) {
        profilePicUpload.addEventListener('change', handleProfilePictureUpload);
    }
    
    // Initialize leaderboard button
    const leaderboardBtn = document.getElementById('leaderboard-btn');
    if (leaderboardBtn) {
        leaderboardBtn.addEventListener('click', showLeaderboard);
    }

    // Initialize targets button
    const targetsBtn = document.getElementById('targets-btn');
    if (targetsBtn) {
        targetsBtn.addEventListener('click', showTargets);
    }

    // Initialize back to app buttons
    const backToAppBtn = document.getElementById('back-to-app');
    if (backToAppBtn) {
        backToAppBtn.addEventListener('click', hideLeaderboard);
    }
    
    const backToAppFromTargets = document.getElementById('back-to-app-from-targets');
    if (backToAppFromTargets) {
        backToAppFromTargets.addEventListener('click', hideTargets);
    }

    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            // If it's not the admin, find the full user object from gameData
            if (user.isAdmin) {
                loginUser(user);
            } else {
                const fullUser = gameData.players.find(p => p._id === user._id);
                if (fullUser) {
                    loginUser(fullUser);
                } else {
                    localStorage.removeItem('currentUser');
                }
            }
        } catch (e) {
            console.error('Error parsing saved user:', e);
            localStorage.removeItem('currentUser');
        }
    }

    // Render initial data
    updateGameStats();
    renderPosts();
    renderPlayersList();
    updateLeaderboard();
}

// Handle player login
function handleLogin() {
    const code = playerCodeInput.value.trim().toUpperCase();
    
    if (!code) {
        alert('Please enter your code');
        return;
    }
    
    // Check if it's an admin code
    const admin = gameData.admins.find(a => a.code === code);
    if (admin) {
        loginUser({ isAdmin: true, name: admin.name });
        return;
    }
    
    // Find player by verification code
    const player = findPlayerByVerificationCode(code);
    
    if (player) {
        // Make sure we have the full player object
        const fullPlayer = gameData.players.find(p => p._id === player._id) || player;
        loginUser(fullPlayer);
    } else {
        alert('Invalid code. Please try again.');
    }
}

// Show admin login prompt
function showAdminLogin() {
    const code = prompt('Enter admin code:');
    if (code) {
        const admin = gameData.admins.find(a => a.code === code);
        if (admin) {
            loginUser({ isAdmin: true, name: admin.name });
        } else {
            alert('Invalid admin code');
        }
    }
}

// Login user and update UI
function loginUser(user) {
    // For non-admin users, make sure we have the full user object
    if (!user.isAdmin) {
        const fullUser = gameData.players.find(p => p._id === user._id) || user;
        // Update the reference to use the full user object
        user = fullUser;
    } else {
        // For admins, ensure we have the full admin object with name
        const admin = gameData.admins.find(a => a.name === user.name);
        if (admin) {
            user = { ...user, name: admin.name };
        }
    }
    
    // Save to localStorage - only store essential data
    const userData = {
        _id: user._id,
        name: user.name,
        isAdmin: user.isAdmin,
        status: user.status
    };
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Set current user in game data
    gameData.currentUser = user;
    
    // Update UI
    loginScreen.style.display = 'none';
    app.style.display = 'block';
    
    if (user.isAdmin) {
        // Update UI for admin
        if (playerNameEl) playerNameEl.textContent = user.name || 'Admin';
        if (playerStatusEl) {
            playerStatusEl.textContent = 'Admin';
            playerStatusEl.className = 'status-badge status-admin';
        }
        // Clear target info for admins
        if (targetNameEl) targetNameEl.textContent = 'N/A';
        if (targetCodeEl) targetCodeEl.textContent = 'N/A';
        // Show admin UI
        document.body.classList.add('admin-logged-in');
        if (adminPanelToggle) adminPanelToggle.style.display = 'block';
    } else {
        // Update UI for regular players
        if (playerNameEl) playerNameEl.textContent = user.name || 'Player';
        if (playerStatusEl) {
            const statusText = user.status === 'active' ? 'Active' : 'Eliminated';
            playerStatusEl.textContent = statusText;
            playerStatusEl.className = `status-badge status-${user.status || 'active'}`;
        }
        // Hide admin UI elements
        document.body.classList.remove('admin-logged-in');
        if (adminPanelToggle) adminPanelToggle.style.display = 'none';
        
        // Update target info if element exists for regular players
        if (targetNameEl && user.target) {
            const target = gameData.players.find(p => p._id === user.target);
            if (target) {
                targetNameEl.textContent = target.name || 'Unknown';
            } else {
                targetNameEl.textContent = 'No target assigned';
            }
        } else if (targetNameEl) {
            targetNameEl.textContent = 'No target assigned';
        }
    }
    
    // Update profile picture if exists
    if (user.image) {
        updateProfilePicture(user.image);
    }
    
    // Find and display target
    const target = findPlayerById(user.target);
    if (target) {
        targetNameEl.textContent = target.name;
    } else {
        targetNameEl.textContent = 'No target assigned';
    }
    
    // Clear input
    playerCodeInput.value = '';
    
    // Update game stats and UI
    updateGameStats();
    renderPosts();
    updateLeaderboard();
    
    // Render players list for admin
    if (user.isAdmin) {
        renderPlayersList();
    }
}

// Handle logout
function handleLogout() {
    gameData.currentUser = null;
    localStorage.removeItem('currentUser');
    
    // Reset UI
    app.style.display = 'none';
    loginScreen.style.display = 'block';
    adminPanel.classList.remove('active');
    document.body.classList.remove('admin-logged-in');
}

// Toggle admin panel
function toggleAdminPanel() {
    const isOpening = !adminPanel.classList.contains('active');
    adminPanel.classList.toggle('active');
    
    if (isOpening) {
        // Refresh data when opening the panel
        updateAdminStats();
        renderPlayersList();
    }
}

// Close admin panel when clicking outside
function handleOutsideClick(e) {
    if (!adminPanel.contains(e.target) && !e.target.closest('#admin-panel-toggle')) {
        adminPanel.classList.remove('active');
        // Close player details modal when clicking outside
        const playerModal = document.getElementById('player-modal');
        if (playerModal) playerModal.classList.remove('active');
    }
}

// Update admin statistics
function updateAdminStats() {
    if (!document.getElementById('total-players')) return;
    
    const now = new Date();
    const totalPlayers = gameData.players.length;
    
    // Clear any expired suspensions
    gameData.players.forEach(player => {
        if (player.suspendedUntil && new Date(player.suspendedUntil) <= now) {
            player.suspendedUntil = null;
            if (player.status === 'suspended') {
                player.status = 'active';
            }
        }
    });
    
    // Count players in each status
    let activeCount = 0;
    let eliminatedCount = 0;
    let suspendedCount = 0;

    gameData.players.forEach(player => {
        const isSuspended = player.status === 'suspended' || 
                          (player.suspendedUntil && new Date(player.suspendedUntil) > now);

        if (player.status === 'eliminated') {
            eliminatedCount++;
        } else if (isSuspended) {
            suspendedCount++;
        } else {
            activeCount++;
        }
    });
    
    const totalKills = gameData.players.reduce((sum, player) => sum + (player.eliminations || 0), 0);
    
    // Update the stats display
    document.getElementById('total-players').textContent = totalPlayers;
    document.getElementById('active-players-count').textContent = activeCount;
    document.getElementById('eliminated-players-count').textContent = eliminatedCount;
    
    // Add or update suspended players count
    let suspendedCountEl = document.getElementById('suspended-players');
    if (!suspendedCountEl) {
        // Add the suspended count stat if it doesn't exist
        const statsContainer = document.querySelector('.admin-stats');
        if (statsContainer) {
            statsContainer.innerHTML += `
                <div class="stat-item">
                    <span class="stat-value" id="suspended-players">${suspendedCount}</span>
                    <span class="stat-label">Suspended</span>
                </div>
            `;
        }
    } else {
        suspendedCountEl.textContent = suspendedCount;
    }
    document.getElementById('total-kills').textContent = totalKills;
    
    // Update game end date
    const endDate = new Date('2025-07-04');
    const today = new Date();
    const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    const endDateEl = document.getElementById('game-end-date');
    if (endDateEl) {
        endDateEl.textContent = `Ends in ${daysLeft} days (July 4th, 2025)`;
    }
}

// Show player details
function showPlayerDetails(playerId) {
    const player = gameData.players.find(p => p._id === playerId);
    if (!player) return;
    
    const modal = document.getElementById('player-modal');
    const modalContent = modal?.querySelector('.modal-body');
    if (!modal || !modalContent) return;
    
    // Find player's target and hunter
    const target = player.target ? gameData.players.find(p => p._id === player.target) : null;
    const hunter = gameData.players.find(p => p.target === player._id);
    const isSuspended = player.suspendedUntil && new Date(player.suspendedUntil) > new Date();
    
    // Update modal content
    document.getElementById('detail-player-name').textContent = player.name;
    
    // Update status badge
    const statusBadge = document.getElementById('detail-player-status');
    const status = isSuspended ? 'suspended' : (player.status === 'eliminated' ? 'eliminated' : 'active');
    statusBadge.className = `status-badge status-${status}`;
    statusBadge.innerHTML = `
        <span class="status-dot"></span>
        <span>${status.charAt(0).toUpperCase() + status.slice(1)}${isSuspended ? ` until ${new Date(player.suspendedUntil).toLocaleDateString()}` : ''}</span>
    `;
    
    // Update stats
    document.getElementById('detail-player-kills').textContent = player.eliminations || 0;
    document.getElementById('detail-player-targets').textContent = player.targetHistory?.length || 0;
    document.getElementById('detail-player-eliminated').textContent = 
        player.eliminatedAt ? new Date(player.eliminatedAt).toLocaleDateString() : 'N/A';
    
    // Update target info
    document.getElementById('detail-current-target').textContent = target?.name || 'None';
    document.getElementById('detail-hunted-by').textContent = hunter?.name || 'None';
    
    // Update avatar
    const avatar = document.getElementById('detail-player-avatar');
    avatar.innerHTML = player.avatar ? 
        `<img src="${player.avatar}" alt="${player.name}">` : 
        `<i class="fas fa-user"></i>`;
    
    // Update action buttons
    const actionButtons = document.getElementById('player-actions');
    actionButtons.innerHTML = '';
    
    // Always show action buttons for active/suspended players
    if (player.status !== 'eliminated') {
        if (isSuspended) {
            // Unsuspend button
            const unsuspendBtn = document.createElement('button');
            unsuspendBtn.className = 'btn btn-warning';
            unsuspendBtn.innerHTML = '<i class="fas fa-user-check"></i> Reinstate Player';
            unsuspendBtn.onclick = () => unsuspendPlayer(player._id);
            actionButtons.appendChild(unsuspendBtn);
        } else {
            // Suspend button
            const suspendBtn = document.createElement('button');
            suspendBtn.className = 'btn btn-warning';
            suspendBtn.innerHTML = '<i class="fas fa-user-slash"></i> Suspend Player';
            suspendBtn.onclick = () => suspendPlayer(player._id);
            actionButtons.appendChild(suspendBtn);
            
            // Eliminate button
            const eliminateBtn = document.createElement('button');
            eliminateBtn.className = 'btn btn-danger';
            eliminateBtn.innerHTML = '<i class="fas fa-skull"></i> Mark as Eliminated';
            eliminateBtn.onclick = () => eliminatePlayer(player._id);
            actionButtons.appendChild(eliminateBtn);
        }
    } else {
        const eliminatedText = document.createElement('div');
        eliminatedText.className = 'text-muted mb-2';
        eliminatedText.textContent = 'This player has been eliminated';
        actionButtons.appendChild(eliminatedText);
        
        // Add Reactivate button for eliminated players
        const reactivateBtn = document.createElement('button');
        reactivateBtn.className = 'btn btn-success';
        reactivateBtn.innerHTML = '<i class="fas fa-undo"></i> Reactivate Player';
        reactivateBtn.onclick = () => {
            player.status = 'active';
            delete player.eliminatedAt;
            updateAdminStats();
            renderPlayersList();
            showPlayerDetails(player._id);
            showNotification(`${player.name} has been reactivated`, 'success');
            saveToLocalStorage();
        };
        actionButtons.appendChild(reactivateBtn);
    }
    
    // Always show Edit button for all players
    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-primary';
    editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Player';
    editBtn.onclick = () => showEditPlayerModal(player._id);
    actionButtons.appendChild(editBtn);
    
    // Show the modal
    modal.classList.add('active');
}

// Show suspend player modal with duration options
function suspendPlayer(playerId) {
    const player = gameData.players.find(p => p._id === playerId);
    if (!player) return;
    
    // Set the player ID in the modal
    document.getElementById('suspend-player-id').value = playerId;
    
    // Reset custom input
    document.getElementById('custom-days').value = '';
    document.getElementById('custom-suspend-container').style.display = 'none';
    
    // Show the modal
    document.getElementById('suspend-player-modal').classList.add('active');
    
    // Add event listeners for suspension options
    document.querySelectorAll('.suspend-option').forEach(btn => {
        btn.onclick = function() {
            const days = this.getAttribute('data-days');
            if (days === 'custom') {
                document.getElementById('custom-suspend-container').style.display = 'block';
            } else {
                applySuspension(playerId, parseInt(days));
            }
        };
    });
    
    // Add event listener for custom apply button
    document.getElementById('apply-custom-suspend').onclick = function() {
        const days = parseInt(document.getElementById('custom-days').value);
        if (days > 0) {
            applySuspension(playerId, days);
        } else {
            showNotification('Please enter a valid number of days', 'error');
        }
    };
}



// Unsuspend a player
function unsuspendPlayer(playerId) {
    const player = gameData.players.find(p => p._id === playerId);
    if (!player) return;
    
    // Only unsuspend if player is actually suspended
    if (!player.suspendedUntil) {
        showNotification('Player is not currently suspended', 'error');
        return;
    }
    
    // Remove suspension and set status back to active if not eliminated
    delete player.suspendedUntil;
    if (player.status !== 'eliminated') {
        player.status = 'active';
    }
    
    // Update UI
    updateAdminStats();
    updateGameStats(); // Update main feed stats
    renderPlayersList();
    showPlayerDetails(playerId);
    
    // Show success message
    showNotification(`Player ${player.name} has been reinstated`, 'success');
    
    // Save changes
    saveToLocalStorage();
}

// Show edit player modal
function showEditPlayerModal(playerId) {
    const player = gameData.players.find(p => p._id === playerId);
    if (!player) return;
    
    // Populate form
    document.getElementById('edit-player-id').value = player._id;
    document.getElementById('edit-name').value = player.name;
    document.getElementById('edit-email').value = player.email || '';
    document.getElementById('edit-status').value = player.status || 'active';
    
    // Show modal
    document.getElementById('edit-player-modal').classList.add('active');
}

// Save edited player
function savePlayerEdits() {
    const playerId = document.getElementById('edit-player-id').value;
    const player = gameData.players.find(p => p._id === playerId);
    if (!player) return;
    
    // Update player data
    player.name = document.getElementById('edit-name').value;
    player.email = document.getElementById('edit-email').value;
    player.status = document.getElementById('edit-status').value;
    
    // Close modal
    document.getElementById('edit-player-modal').classList.remove('active');
    
    // Update UI
    updateAdminStats();
    renderPlayersList();
    showPlayerDetails(playerId);
    
    // Show success message
    showNotification('Player updated successfully', 'success');
    
    // Save changes
    saveToLocalStorage();
}

// Close player details modal
function closePlayerModal() {
    document.getElementById('player-modal').classList.remove('active');
}

// Initialize admin search
function initAdminSearch() {
    const searchInput = document.getElementById('admin-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderPlayersList(e.target.value);
        });
    }
    
    // Close modal when clicking the X
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closePlayerModal);
    }
}

// Switch between tabs in admin panel
function switchTab(e) {
    const tabId = e.target.dataset.tab;
    
    // Update active tab button
    tabBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Show corresponding tab content
    tabContents.forEach(content => {
        if (content.id === `${tabId}-tab`) {
            content.style.display = 'block';
        } else {
            content.style.display = 'none';
        }
    });
}

// Update game statistics
function updateGameStats() {
    console.log('Updating game stats...');
    
    // Get the stat value elements
    const activeEl = document.querySelector('#active-stat .stat-value');
    const eliminatedEl = document.querySelector('#eliminated-stat .stat-value');
    const suspendedEl = document.querySelector('#suspended-stat .stat-value');
    const daysLeftEl = document.querySelector('#days-left-stat .stat-value');
    const totalEl = document.querySelector('#total-stat .stat-value');
    
    const now = new Date();
    let suspensionCleared = false;

    // First, clear any expired suspensions
    gameData.players.forEach(player => {
        if (player.suspendedUntil && new Date(player.suspendedUntil) <= now) {
            player.suspendedUntil = null;
            if (player.status === 'suspended') {
                player.status = 'active'; // Reset status to active when suspension expires
                suspensionCleared = true;
            }
        }
    });

    // Count players in each status
    let activeCount = 0;
    let eliminatedCount = 0;
    let suspendedCount = 0;
    const totalPlayers = gameData.players.length;

    gameData.players.forEach(player => {
        const isSuspended = player.status === 'suspended' || 
                          (player.suspendedUntil && new Date(player.suspendedUntil) > now);

        if (player.status === 'eliminated') {
            eliminatedCount++;
        } else if (isSuspended) {
            suspendedCount++;
        } else {
            activeCount++;
        }
    });

    // Update the UI elements directly
    if (totalEl) totalEl.textContent = totalPlayers;
    if (activeEl) activeEl.textContent = activeCount;
    if (eliminatedEl) eliminatedEl.textContent = eliminatedCount;
    if (suspendedEl) suspendedEl.textContent = suspendedCount;
    
    // Update days left if the element exists
    if (daysLeftEl) {
        const gameEndDate = new Date('2025-07-04');
        const today = new Date();
        const diffTime = gameEndDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        daysLeftEl.textContent = diffDays > 0 ? diffDays : 0;
    }

    // Also update the admin stats and UI if a suspension was cleared
    if (suspensionCleared) {
        updateAdminStats();
        renderPlayersList();
        updateLeaderboard();
    } else {
        // Still update admin stats to ensure consistency
        updateAdminStats();
    }

    // Save any changes (like cleared suspensions)
    if (suspensionCleared) {
        saveToLocalStorage();
    }
}

// Render posts in the feed
function renderPosts() {
    if (!postsContainer) return;
    
    // Sort posts by timestamp (newest first)
    const sortedPosts = [...gameData.posts].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    // Clear existing posts
    postsContainer.innerHTML = '';
    
    // Add each post to the feed
    sortedPosts.forEach(post => {
        const postEl = document.createElement('div');
        postEl.className = 'card post fade-in';
        postEl.innerHTML = `
            <div class="post-header">
                <img src="${post.userImage}" alt="${post.userName}" class="post-avatar">
                <div class="post-user-info">
                    <h4>${post.userName}</h4>
                    <span class="post-time">${formatTimeAgo(post.timestamp)}</span>
                </div>
            </div>
            <div class="post-content">
                <p>${post.content}</p>
                ${post.image ? `<div class="post-image">
                    <img src="${post.image}" alt="Post" style="width: 100%; border-radius: 8px; margin-top: 10px;">
                </div>` : ''}
            </div>
            <div class="post-actions">
                <button class="action-btn">
                    <i class="far fa-heart"></i> ${post.likes}
                </button>
                <button class="action-btn">
                    <i class="far fa-comment"></i> ${post.comments}
                </button>
                <button class="action-btn">
                    <i class="fas fa-share"></i> Share
                </button>
            </div>
        `;
        postsContainer.appendChild(postEl);
    });
}

// Render players list in admin panel with search filtering
function renderPlayersList(searchTerm = '') {
    const playersList = document.getElementById('players-list');
    if (!playersList) return;
    
    // Filter players based on search term
    const filteredPlayers = gameData.players.filter(player => 
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (player.email && player.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    playersList.innerHTML = '';
    
    if (filteredPlayers.length === 0) {
        playersList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <p>No players found</p>
            </div>
        `;
        return;
    }
    
    filteredPlayers.forEach(player => {
        const target = player.target ? gameData.players.find(p => p._id === player.target) : null;
        const playerEl = document.createElement('div');
        playerEl.className = 'player-row';
        playerEl.onclick = (e) => {
            // Don't show details if clicking on action buttons
            if (!e.target.closest('.actions')) {
                showPlayerDetails(player._id);
            }
        };
        
        const isEliminated = player.status === 'eliminated';
        const isSuspended = player.status === 'suspended';
        
        playerEl.innerHTML = `
            <div class="player-info">
                <div class="player-avatar">
                    ${player.avatar ? 
                        `<img src="${player.avatar}" alt="${player.name}">` : 
                        `<i class="fas fa-user"></i>`}
                </div>
                <div>
                    <div class="player-name">${player.name}</div>
                    ${player.email ? `<div class="player-email">${player.email}</div>` : ''}
                </div>
            </div>
            <div>
                <span class="status-badge status-${player.status || 'active'}">
                    <span class="status-dot"></span>
                    ${isEliminated ? 'Eliminated' : isSuspended ? 
                        `Suspended (${formatTimeRemaining(player.suspendedUntil)})` : 
                        'Active'}
                </span>
            </div>
            <div class="kills-count">${player.eliminations || 0}</div>
            <div>
                ${target ? 
                    `<span class="player-target">${target.name}</span>` : 
                    '<span class="text-muted">No target</span>'}
            </div>
            <div class="actions">
                <button class="btn-more" onclick="event.stopPropagation(); this.nextElementSibling.classList.toggle('active')">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
                <div class="action-dropdown">
                    ${!isEliminated ? `
                        <button class="danger" onclick="event.stopPropagation(); eliminatePlayer('${player._id}')">
                            <i class="fas fa-skull"></i> Mark as Eliminated
                        </button>
                    ` : `
                        <button class="success" onclick="event.stopPropagation(); revivePlayer('${player._id}')">
                            <i class="fas fa-heart"></i> Revive Player
                        </button>
                    `}
                    ${!isSuspended ? `
                        <button class="warning" onclick="event.stopPropagation(); applySuspension('${player._id}', 2)">
                            <i class="fas fa-pause"></i> Suspend for 2 Days
                        </button>
                    ` : `
                        <button class="success" onclick="event.stopPropagation(); unsuspendPlayer('${player._id}')">
                            <i class="fas fa-play"></i> Unsuspend Player
                        </button>
                    `}
                    <div class="divider"></div>
                    <button class="danger" onclick="event.stopPropagation(); if(confirm('Are you sure you want to remove this player?')) { removePlayer('${player._id}') }">
                        <i class="fas fa-trash"></i> Remove Player
                    </button>
                </div>
            </div>
        `;
        playersList.appendChild(playerEl);
    });
}

// Sort configuration
let sortConfig = {
    field: 'rank',
    direction: 'asc'  // 'asc' or 'desc'
};

// Get players with proper ranking (handling ties)
function getLeaderboardPlayers() {
    // First, create a copy of players with additional fields
    let players = gameData.players.map(player => ({
        ...player,
        kills: player.eliminations || 0,
        status: player.status || 'active'
    }));

    // Sort by kills (descending) to calculate ranks
    players.sort((a, b) => b.kills - a.kills);
    
    // Calculate ranks with ties
    if (players.length > 0) {
        let currentRank = 1;
        let previousKills = players[0].kills;
        players[0].rank = currentRank;
        
        for (let i = 1; i < players.length; i++) {
            if (players[i].kills === previousKills) {
                // Same kills as previous player, same rank
                players[i].rank = currentRank;
            } else {
                // New rank based on position (1-based index)
                currentRank = i + 1;
                players[i].rank = currentRank;
                previousKills = players[i].kills;
            }
        }
    }
    
    // Now sort based on current sort configuration
    return [...players].sort((a, b) => {
        let valueA, valueB;
        
        switch (sortConfig.field) {
            case 'rank':
                valueA = a.rank;
                valueB = b.rank;
                // If same rank, sort by kills (descending) then by name (ascending)
                if (valueA === valueB) {
                    if (b.kills !== a.kills) {
                        return b.kills - a.kills;
                    }
                    return a.name.localeCompare(b.name);
                }
                break;
            case 'name':
                valueA = a.name.toLowerCase();
                valueB = b.name.toLowerCase();
                break;
            case 'kills':
                valueA = a.kills;
                valueB = b.kills;
                // If same kills, maintain current ranking
                if (valueA === valueB) {
                    return a.rank - b.rank;
                }
                break;
            case 'status':
                valueA = a.status;
                valueB = b.status;
                // If same status, sort by rank
                if (valueA === valueB) {
                    return a.rank - b.rank;
                }
                break;
            default:
                valueA = a.rank;
                valueB = b.rank;
        }

        let comparison = 0;
        if (valueA > valueB) {
            comparison = 1;
        } else if (valueA < valueB) {
            comparison = -1;
        }

        return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
}

// Update leaderboard based on player eliminations
function updateLeaderboard() {
    const leaderboardContainer = document.getElementById('leaderboard');
    if (!leaderboardContainer) return;
    
    const playersWithEliminations = getLeaderboardPlayers();
    const hasEliminations = playersWithEliminations.some(player => player.eliminations > 0);
    
    if (!hasEliminations) {
        // Show empty state when no eliminations yet
        leaderboardContainer.innerHTML = `
            <div class="empty-leaderboard">
                <i class="fas fa-trophy"></i>
                <p>No eliminations yet</p>
                <small>Check back after the first eliminations are recorded</small>
            </div>
        `;
        return;
    }
    
    // Show top 3 players with eliminations
    let leaderboardHTML = '';
    playersWithEliminations
        .filter(player => player.eliminations > 0)
        .slice(0, 3)
        .forEach((player, index) => {
            leaderboardHTML += `
                <div class="leaderboard-item">
                    <span class="rank">${index + 1}</span>
                    <div class="leaderboard-avatar">
                        ${player.image ? 
                            `<img src="${player.image}" alt="${player.name}">` : 
                            `<i class="fas fa-user"></i>`
                        }
                    </div>
                    <span class="leaderboard-name">${player.name}</span>
                    <span class="leaderboard-score">${player.eliminations} ${player.eliminations === 1 ? 'kill' : 'kills'}</span>
                </div>
            `;
        });
    
    leaderboardContainer.innerHTML = leaderboardHTML;
}

// Apply suspension to a player for a specific number of days
function applySuspension(playerId, days) {
    const player = gameData.players.find(p => p._id === playerId);
    if (!player) return;
    
    // Calculate suspension end time (current time + specified days)
    const suspendedUntil = new Date();
    suspendedUntil.setDate(suspendedUntil.getDate() + days);
    
    player.status = 'suspended';
    player.suspendedUntil = suspendedUntil.toISOString();
    
    // Update UI
    renderPlayersList();
    updateLeaderboard();
    saveToLocalStorage();
    
    // Show success message with duration
    showAdminMessage(`Player ${player.name} has been suspended for ${days} day${days !== 1 ? 's' : ''}.`);
    
    // Start checking for expired suspensions
    checkSuspensions();
}

// Check and update expired suspensions
function checkSuspensions() {
    const now = new Date();
    let updated = false;
    
    gameData.players.forEach(player => {
        if (player.suspendedUntil) {
            const suspendEnd = new Date(player.suspendedUntil);
            if (now >= suspendEnd) {
                console.log(`Suspension ended for player: ${player.name}`);
                // Only update if player wasn't eliminated during suspension
                if (player.status !== 'eliminated') {
                    player.status = 'active';
                    console.log(`Player ${player.name} status set to active`);
                }
                delete player.suspendedUntil;
                updated = true;
                
                // Show notification in the UI
                const notification = document.createElement('div');
                notification.className = 'notification success';
                notification.textContent = `Player ${player.name}'s suspension has ended.`;
                document.body.appendChild(notification);
                
                // Remove notification after 5 seconds
                setTimeout(() => {
                    notification.remove();
                }, 5000);
                
                // Show notification to the player if they're logged in
                const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                if (currentUser && currentUser._id === player._id) {
                    const playerNotification = document.createElement('div');
                    playerNotification.className = 'notification success';
                    playerNotification.textContent = 'Your suspension has ended! Welcome back!';
                    document.body.appendChild(playerNotification);
                    
                    setTimeout(() => {
                        playerNotification.remove();
                    }, 5000);
                }
            }
        }
    });
    
    if (updated) {
        console.log('Updating UI after suspension expiration');
        // Update all relevant UI components
        updateAdminStats();
        updateGameStats();
        renderPlayersList();
        updateLeaderboard();
        
        // Save changes to localStorage
        saveToLocalStorage();
        
        // Force a re-render of any player details that might be open
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser && currentUser._id) {
            showPlayerDetails(currentUser._id);
        }
    }
    
    // Check again in 1 minute
    setTimeout(checkSuspensions, 60000);
}

// Unsuspend a player manually
function unsuspendPlayer(playerId) {
    const player = gameData.players.find(p => p._id === playerId);
    if (!player || player.status !== 'suspended') {
        const notification = document.createElement('div');
        notification.className = 'notification error';
        notification.textContent = 'Player is not currently suspended or not found';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
        return;
    }
    
    player.status = 'active';
    delete player.suspendedUntil;
    
    // Update UI
    updateGameStats();
    updateAdminStats();
    renderPlayersList();
    updateLeaderboard();
    
    // Save changes
    saveToLocalStorage();
    
    // Show success notification
    const successNotification = document.createElement('div');
    successNotification.className = 'notification success';
    successNotification.textContent = `Player ${player.name} has been unsuspended.`;
    document.body.appendChild(successNotification);
    setTimeout(() => successNotification.remove(), 5000);
}

// Apply suspension to a player for a specific number of days
function applySuspension(playerId, days) {
    const player = gameData.players.find(p => p._id === playerId);
    if (!player) {
        console.error('Player not found:', playerId);
        return;
    }
    
    // Only allow suspending active players
    if (player.status !== 'active') {
        const notification = document.createElement('div');
        notification.className = 'notification error';
        notification.textContent = `Cannot suspend player with status: ${player.status}`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
        return;
    }
    
    try {
        // Set suspension for specified number of days from now
        const suspendedUntil = new Date();
        suspendedUntil.setDate(suspendedUntil.getDate() + days);
        player.suspendedUntil = suspendedUntil.toISOString();
        player.status = 'suspended';
        
        // Close the modal if it's open
        const modal = document.getElementById('suspend-player-modal');
        if (modal) {
            modal.classList.remove('active');
        }
        
        // Update UI
        updateGameStats();
        updateAdminStats();
        renderPlayersList();
        updateLeaderboard();
        
        // Format duration text for notification
        let durationText = '';
        if (days === 1) {
            durationText = '1 day';
        } else if (days < 30) {
            durationText = `${days} days`;
        } else if (days === 30) {
            durationText = '1 month';
        } else if (days < 365) {
            durationText = `${Math.round(days/30)} months`;
        } else {
            durationText = '1 year';
        }
        
        // Show success notification
        const successNotification = document.createElement('div');
        successNotification.className = 'notification success';
        successNotification.textContent = `Player ${player.name} has been suspended for ${durationText} (until ${new Date(suspendedUntil).toLocaleDateString()})`;
        document.body.appendChild(successNotification);
        setTimeout(() => successNotification.remove(), 5000);
        
        // Save changes
        saveToLocalStorage();
        
        // Start checking for expired suspensions if not already running
        if (typeof window.suspensionCheckInterval === 'undefined') {
            checkSuspensions();
        }
        
    } catch (error) {
        console.error('Error in applySuspension:', error);
        const errorNotification = document.createElement('div');
        errorNotification.className = 'notification error';
        errorNotification.textContent = 'Failed to suspend player. Please try again.';
        document.body.appendChild(errorNotification);
        setTimeout(() => errorNotification.remove(), 5000);
    }
}

// Make functions available globally
window.applySuspension = applySuspension;
window.unsuspendPlayer = unsuspendPlayer;

// Format remaining time (e.g., "2h 30m")
function formatTimeRemaining(endTime) {
    if (!endTime) return '0m';
    
    const now = new Date();
    const end = new Date(endTime);
    const diffMs = end - now;
    
    if (diffMs <= 0) return '0m';
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

// Format timestamp to relative time (e.g., "2 hours ago")
function formatTimeAgo(timestamp) {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + ' year' + (interval === 1 ? '' : 's') + ' ago';
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + ' month' + (interval === 1 ? '' : 's') + ' ago';
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + ' day' + (interval === 1 ? '' : 's') + ' ago';
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + ' hour' + (interval === 1 ? '' : 's') + ' ago';
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + ' minute' + (interval === 1 ? '' : 's') + ' ago';
    
    return 'just now';
}

// Revive a player (admin function)
function revivePlayer(playerId) {
    const player = gameData.players.find(p => p._id === playerId);
    if (!player) return;
    
    player.status = 'active';
    player.eliminatedAt = null;
    player.eliminatedBy = null;
    
    // Update UI
    renderPlayersList();
    updateLeaderboard();
    saveToLocalStorage();
    
    // Show success message
    showAdminMessage(`Player ${player.name} has been revived.`);
}

// Remove a player from the game (admin function)
function removePlayer(playerId) {
    const playerIndex = gameData.players.findIndex(p => p._id === playerId);
    if (playerIndex === -1) return;
    
    const player = gameData.players[playerIndex];
    
    // Remove the player from the game
    gameData.players.splice(playerIndex, 1);
    
    // Update any references to this player as a target
    gameData.players.forEach(p => {
        if (p.target === playerId) {
            p.target = null;
        }
        
        // Remove from previous targets
        if (p.previousTargets && p.previousTargets.includes(playerId)) {
            p.previousTargets = p.previousTargets.filter(id => id !== playerId);
        }
    });
    
    // Update UI
    renderPlayersList();
    updateLeaderboard();
    saveToLocalStorage();
    
    // Show success message
    showAdminMessage(`Player ${player.name} has been removed from the game.`);
}

// Make functions available globally
window.revivePlayer = revivePlayer;
window.removePlayer = removePlayer;

// Eliminate a player (admin function)
function eliminatePlayer(playerId, eliminatedById = null) {
    const player = gameData.players.find(p => p._id === playerId);
    if (!player || player.status === 'eliminated') return;
    
    // Store the old target before making any changes
    const oldTargetId = player.target;
    
    // Mark player as eliminated
    player.status = 'eliminated';
    
    // Find the player's hunter (the one who eliminated them)
    const hunter = eliminatedById ? 
        gameData.players.find(p => p._id === eliminatedById) : 
        gameData.players.find(p => p.target === playerId);
    
    if (hunter) {
        // Add the eliminated target to hunter's target history
        if (playerId) {
            // Initialize previousTargets array if it doesn't exist
            hunter.previousTargets = hunter.previousTargets || [];
            // Add the eliminated player to hunter's previous targets
            hunter.previousTargets.push(playerId);
        }
        
        // Give the hunter their target's target (target inheritance)
        if (player.target) {
            // Store the old target before changing it
            const oldHunterTarget = hunter.target;
            
            // Update hunter's target to the eliminated player's target
            hunter.target = player.target;
            hunter.eliminations = (hunter.eliminations || 0) + 1;
            
            // If the hunter had a previous target, add it to their history
            if (oldHunterTarget) {
                hunter.previousTargets = hunter.previousTargets || [];
                if (!hunter.previousTargets.includes(oldHunterTarget)) {
                    hunter.previousTargets.push(oldHunterTarget);
                }
            }
            
            // Update the hunter's target in the UI if they are the current user
            if (gameData.currentUser && gameData.currentUser._id === hunter._id) {
                const target = findPlayerById(hunter.target);
                if (targetNameEl) {
                    targetNameEl.textContent = target ? target.name : 'No target assigned';
                }
                
                // Re-render targets view if it's open
                const targetsView = document.getElementById('targets-view');
                if (targetsView && targetsView.style.display === 'block') {
                    showTargets(); // Use showTargets to refresh the entire view
                }
            }
        }
        
        // Update leaderboard when eliminations occur
        updateLeaderboard();
    }
    
    // If the current user was eliminated, update their UI
    if (gameData.currentUser && gameData.currentUser._id === playerId) {
        if (playerStatusEl) {
            playerStatusEl.textContent = 'Eliminated';
            playerStatusEl.className = 'status-badge status-eliminated';
        }
        // Clear their target display
        if (targetNameEl) {
            targetNameEl.textContent = 'Eliminated';
        }
    }
    
    // Update game stats and UI
    updateGameStats();
    renderPlayersList(); // Update the admin's player list
    
    // If we're in the targets view, re-render it
    const targetsView = document.getElementById('targets-view');
    if (targetsView && targetsView.style.display === 'block') {
        showTargets(); // Use showTargets to refresh the entire view
    }
    
    // Save the updated game state
    saveToLocalStorage();
    
    // Show success message
    const adminMessage = document.getElementById('admin-message');
    if (adminMessage) {
        adminMessage.textContent = `${player.name} has been eliminated!`;
        adminMessage.style.display = 'block';
        setTimeout(() => {
            adminMessage.style.display = 'none';
        }, 3000);
    }
}

// Make eliminatePlayer function available globally for button clicks
window.eliminatePlayer = eliminatePlayer;

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Hide any admin messages that might be visible
    const adminMessage = document.getElementById('admin-message');
    if (adminMessage) {
        adminMessage.style.display = 'none';
    }
    
    // Start checking for expired suspensions
    checkSuspensions();
    
    // Initialize game data first
    initializeGameData();
    // Then initialize the app
    init();
    
    // Set up rules modal
    const rulesBtn = document.getElementById('rules-btn');
    const rulesModal = document.getElementById('rules-modal');
    const closeRulesBtn = document.getElementById('close-rules-modal');
    
    // Set up credits modal
    const creditsBtn = document.getElementById('credits-btn');
    const creditsModal = document.getElementById('credits-modal');
    const closeCreditsBtn = document.getElementById('close-credits-modal');
    
    // Set up image modal
    const imageModal = document.getElementById('image-modal');
    const closeImageModal = document.getElementById('close-image-modal');
    const enlargedImg = document.getElementById('enlarged-img');
    
    // Function to open image modal
    function openImageModal(imgSrc) {
        enlargedImg.src = imgSrc;
        imageModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // Function to close image modal
    function closeImageModalFunc() {
        imageModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    if (rulesBtn && rulesModal) {
        rulesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            rulesModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });
    }
    
    if (closeRulesBtn) {
        closeRulesBtn.addEventListener('click', () => {
            rulesModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        });
    }
    
    // Set up credits modal
    if (creditsBtn && creditsModal) {
        creditsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            creditsModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeCreditsBtn) {
        closeCreditsBtn.addEventListener('click', () => {
            creditsModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modals when clicking outside of them
    window.addEventListener('click', (e) => {
        if (e.target === rulesModal) {
            rulesModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        } else if (e.target === creditsModal) {
            creditsModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        } else if (e.target === imageModal) {
            closeImageModalFunc();
        }
    });
    
    // Close image modal when clicking the close button
    if (closeImageModal) {
        closeImageModal.addEventListener('click', closeImageModalFunc);
    }
    
    // Add click event to enlargeable images
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('enlargeable')) {
            e.preventDefault();
            openImageModal(e.target.src);
        }
    });
        
    // Admin tab visibility is handled in the loginUser function
});
