import React, { useState, useEffect } from 'react';
import { socketService } from '../socketService';

const PlayerStatus = ({ gameId, userId, isAdmin = false }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eliminationProof, setEliminationProof] = useState('');

  // Initialize socket connection
  useEffect(() => {
    socketService.connect(gameId, userId);
    
    // Set up event listeners
    socketService.on('player_eliminated', handlePlayerEliminated);
    socketService.on('game_status_updated', handleGameStatusUpdated);
    socketService.on('error', handleError);
    
    // Load initial data
    fetchPlayers();
    
    return () => {
      socketService.disconnect();
    };
  }, [gameId, userId]);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/games/${gameId}/players`);
      const data = await response.json();
      
      if (response.ok) {
        setPlayers(data.players || []);
      } else {
        throw new Error(data.message || 'Failed to fetch players');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching players:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminatePlayer = async (targetId) => {
    if (!eliminationProof) {
      setError('Please provide proof of elimination');
      return;
    }

    try {
      const response = await fetch(
        `/api/games/${gameId}/players/${targetId}/eliminate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ proofUrl: eliminationProof }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to eliminate player');
      }

      setEliminationProof('');
      // The actual update will be handled by the socket event
    } catch (err) {
      setError(err.message);
      console.error('Error eliminating player:', err);
    }
  };

  // Socket event handlers
  const handlePlayerEliminated = (data) => {
    setPlayers(prevPlayers => 
      prevPlayers.map(player => 
        player._id === data.playerId 
          ? { ...player, status: 'eliminated' } 
          : player
      )
    );
  };

  const handleGameStatusUpdated = (data) => {
    // Refresh players when game status changes
    if (['active', 'paused', 'completed'].includes(data.status)) {
      fetchPlayers();
    }
  };

  const handleError = (error) => {
    setError(error.message || 'An error occurred');
    console.error('WebSocket error:', error);
  };

  if (loading) {
    return <div className="loading">Loading player statuses...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="player-status">
      <h2>Player Status</h2>
      
      {!isAdmin && (
        <div className="elimination-form">
          <h3>Report Elimination</h3>
          <div className="form-group">
            <label htmlFor="proofUrl">Proof URL (image/video):</label>
            <input
              type="url"
              id="proofUrl"
              value={eliminationProof}
              onChange={(e) => setEliminationProof(e.target.value)}
              placeholder="https://example.com/proof.jpg"
              required
            />
          </div>
          <div className="targets-list">
            <h4>Select Target:</h4>
            {players
              .filter(player => 
                player.status === 'alive' && 
                player._id !== userId // Can't eliminate yourself
              )
              .map(player => (
                <div key={player._id} className="target-card">
                  <span>{player.name}</span>
                  <button
                    className="btn btn-eliminate"
                    onClick={() => handleEliminatePlayer(player._id)}
                    disabled={!eliminationProof}
                  >
                    Eliminate
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="players-list">
        <h3>All Players</h3>
        <div className="player-grid">
          {players.map(player => (
            <div 
              key={player._id} 
              className={`player-card ${player.status}`}
            >
              <div className="player-name">{player.name}</div>
              <div className="player-status-badge">
                {player.status === 'alive' ? 'Alive' : 'Eliminated'}
              </div>
              {player.status === 'eliminated' && player.eliminatedBy && (
                <div className="eliminated-by">
                  Eliminated by: {player.eliminatedBy.name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerStatus;
