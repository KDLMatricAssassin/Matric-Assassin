// Initialize the admin dashboard when the admin logs in
document.addEventListener('DOMContentLoaded', () => {
  const adminPanel = document.getElementById('admin-panel');
  const adminContent = document.getElementById('admin-content');
  
  // Function to render the admin dashboard
  const renderAdminDashboard = (gameId, userId) => {
    // Clear existing content
    adminContent.innerHTML = '';
    
    // Create a root element for React
    const root = document.createElement('div');
    root.id = 'admin-root';
    adminContent.appendChild(root);
    
    // Initialize the AdminDashboard component
    const adminDashboard = React.createElement(AdminDashboard, { gameId, userId });
    ReactDOM.render(adminDashboard, root);
  };
  
  // Handle admin login
  const adminLoginBtn = document.getElementById('admin-login-btn');
  if (adminLoginBtn) {
    adminLoginBtn.addEventListener('click', async () => {
      try {
        // In a real app, you would have proper admin authentication
        const gameId = prompt('Enter game ID:');
        const userId = 'admin-' + Date.now(); // Temporary admin user ID
        
        // Show the admin panel
        document.getElementById('login-screen').style.display = 'none';
        adminPanel.style.display = 'block';
        
        // Initialize the admin dashboard
        renderAdminDashboard(gameId, userId);
      } catch (error) {
        console.error('Admin login error:', error);
        alert('Failed to initialize admin dashboard');
      }
    });
  }
  
  // Handle back to app button
  const backToAppBtn = document.getElementById('back-to-app-from-admin');
  if (backToAppBtn) {
    backToAppBtn.addEventListener('click', () => {
      adminPanel.style.display = 'none';
      document.getElementById('login-screen').style.display = 'flex';
      
      // Clean up
      const root = document.getElementById('admin-root');
      if (root) {
        ReactDOM.unmountComponentAtNode(root);
      }
    });
  }
});
