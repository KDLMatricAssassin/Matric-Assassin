import React, { useState, useEffect } from 'react';
import { socketService } from '../socketService';

const AdminDashboard = ({ gameId, userId }) => {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [pendingEliminations, setPendingEliminations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    socketService.connect(gameId, userId);
    
    // Join admin room
    socketService.socket.emit('joinAdmin', { gameId });
    
    // Load initial data
    fetchPendingApprovals();
    
    // Set up event listeners
    socketService.on('new_pending_post', handleNewPendingPost);
    socketService.on('post_updated', handlePostUpdated);
    socketService.on('player_eliminated', handlePlayerEliminated);
    
    return () => {
      socketService.disconnect();
    };
  }, [gameId, userId]);

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/games/${gameId}/pending-approvals`);
      const data = await response.json();
      
      if (response.ok) {
        setPendingPosts(data.pendingPosts || []);
        setPendingEliminations(data.pendingEliminations || []);
      } else {
        throw new Error(data.message || 'Failed to fetch pending approvals');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching pending approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePost = async (postId) => {
    await updatePostStatus(postId, 'approved');
  };

  const handleRejectPost = async (postId) => {
    await updatePostStatus(postId, 'rejected');
  };

  const updatePostStatus = async (postId, status) => {
    try {
      const response = await fetch(
        `/api/admin/games/${gameId}/posts/${postId}/approve`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update post status');
      }

      // The actual update will be handled by the socket event
    } catch (err) {
      setError(err.message);
      console.error('Error updating post status:', err);
    }
  };

  const handleApproveElimination = async (playerId) => {
    try {
      const response = await fetch(
        `/api/admin/games/${gameId}/players/${playerId}/eliminate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ approved: true }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to approve elimination');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error approving elimination:', err);
    }
  };

  // Socket event handlers
  const handleNewPendingPost = (data) => {
    setPendingPosts(prev => [data.post, ...prev]);
  };

  const handlePostUpdated = (data) => {
    setPendingPosts(prev => prev.filter(post => post._id !== data.postId));
  };

  const handlePlayerEliminated = (data) => {
    setPendingEliminations(prev => 
      prev.filter(el => el.player._id !== data.playerId)
    );
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      
      <div className="admin-section">
        <h3>Pending Posts ({pendingPosts.length})</h3>
        {pendingPosts.length > 0 ? (
          <div className="posts-list">
            {pendingPosts.map(post => (
              <div key={post._id} className="post-card">
                <div className="post-content">{post.content}</div>
                <div className="post-author">By: {post.author?.name || 'Unknown'}</div>
                <div className="post-actions">
                  <button 
                    className="btn btn-approve"
                    onClick={() => handleApprovePost(post._id)}
                  >
                    Approve
                  </button>
                  <button 
                    className="btn btn-reject"
                    onClick={() => handleRejectPost(post._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No pending posts</p>
        )}
      </div>

      <div className="admin-section">
        <h3>Pending Eliminations ({pendingEliminations.length})</h3>
        {pendingEliminations.length > 0 ? (
          <div className="eliminations-list">
            {pendingEliminations.map(el => (
              <div key={el._id} className="elimination-card">
                <div className="player-info">
                  Player: {el.player?.name || 'Unknown'}
                </div>
                {el.eliminationProof && (
                  <div className="proof-section">
                    <p>Proof:</p>
                    <img 
                      src={el.eliminationProof} 
                      alt="Elimination proof" 
                      className="proof-image"
                    />
                  </div>
                )}
                <div className="elimination-actions">
                  <button 
                    className="btn btn-approve"
                    onClick={() => handleApproveElimination(el.player._id)}
                  >
                    Approve Elimination
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No pending eliminations</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
