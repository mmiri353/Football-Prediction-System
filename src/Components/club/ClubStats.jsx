import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { firestore } from '../firebaseConfig';
import './ClubStats.css';
import { PiSoccerBallFill } from "react-icons/pi";
import { BsFillTrophyFill } from "react-icons/bs";

const ClubStats = () => {
  const [players, setPlayers] = useState([]);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { teamId } = useParams(); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayersAndTeamData = async () => {
      try {
        
        const teamDoc = await firestore.collection('teams').doc(teamId).get();
        if (teamDoc.exists) {
          const teamData = teamDoc.data();
          setTeam({ ...teamData, id: teamDoc.id });
        } else {
          setError('Team not found.');
          setLoading(false);
          return;
        }
        const playersSnapshot = await firestore.collectionGroup('players').get();
        const playerPromises = playersSnapshot.docs.map(async (doc) => {
          const playerData = doc.data();
          const teamRef = doc.ref.parent.parent;
          if (teamRef) {
            const teamSnapshot = await teamRef.get();
            if (teamSnapshot.exists) {
              playerData.team = { ...teamSnapshot.data(), id: teamSnapshot.id };
            }
          }
          return { ...playerData, id: doc.id };
        });

        const playersData = await Promise.all(playerPromises);
        const filteredPlayers = playersData.filter(player => 
          player.role !== 'Coache' && player.role !== 'Assistant coach'
        );
        setPlayers(filteredPlayers);
      } catch (error) {
        console.error('Error fetching players and team data:', error);
        setError('An error occurred while fetching players and team data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayersAndTeamData();
  }, [teamId]); // Re-run the effect when teamId changes

  const handlePlayerClick = (playerName) => {
    navigate(`/player/${playerName}`);
  };

  const getTopPlayers = (stat) => {
    return players
      .filter((player) => player[stat] != null && player.team?.id === teamId) // Filter by teamId
      .sort((a, b) => b[stat] - a[stat])
      .slice(0, 5);
  };

  const renderRankings = (stat, label) => {
    const topPlayers = getTopPlayers(stat);


    return (
      
      
      <div className="stat-container" key={stat}>
      
        <h3 className="h3">{label}</h3>
        <div className="top-player-image">
          {topPlayers[0] && (
            <img
              src={topPlayers[0].imageUrl}
              alt={topPlayers[0].name}
              className="player-image-custom"
            />
          )}
        </div>
        <div className="rankings">
          {topPlayers.map((player, index) => (
            <div
              key={`${player.id}-${stat}`} 
              className={`stat-item ${index === 0 ? 'top-player' : ''}`}
              onClick={() => handlePlayerClick(player.name)}
            >
              <span className="rank">{index + 1}. </span>
              <img
                src={player.team?.imageUrl || ''}
                alt={player.team?.name || 'Team Logo'}
                className="team-logo"
              />
              <span className="player-name">{player.name}</span>
              <span className="player-stat">{player[stat]}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };


  const renderPlayerTable = () => {
    if (!team) return null;

    const teamPlayers = players.filter(
      (player) => player.team && player.team.id === teamId // Filter by teamId
    );

    return (
      <div className="player-stats-table">
        <h3 className="h32">Statistics for {team.name}</h3>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Number</th>
              <th>Position</th>
              <th>Name</th>
              <th>Goals</th>
              <th>Assists</th>
              <th>Shots</th>
              <th>Matches Played</th>
              <th>Minutes</th>
              <th>Starts</th>
              <th>Substitutions</th>
              <th>Fouls</th>
              <th>Penalties</th>
              <th>Yellow Cards</th>
              <th>Red Cards</th>
              <th>Double Yellow Cards</th>
            </tr>
          </thead>
          <tbody>
            {teamPlayers.map((player) => (
              <tr key={player.id}>
                <td>
                  <img
                    src={player.imageUrl} 
                    alt={player.name} 
                    className="tableimg"
                  />
                </td>
                <td>{player.number}</td>
                <td>{player.role}</td>
                <td>{player.name}</td>
                <td>{player.goals || 0}</td>
                <td>{player.assists || 0}</td>
                <td>{player.shots || 0}</td>
                <td>{player.matchesPlayed || 0}</td>
                <td>{player.minutes || 0}</td>
                <td>{player.starts || 0}</td>
                <td>{player.substitutions || 0}</td>
                <td>{player.fouls || 0}</td>
                <td>{player.penalties || 0}</td>
                <td>{player.yellowCards || 0}</td>
                <td>{player.redCards || 0}</td>
                <td>{player.doubleYellowCards || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

 
  const totalGoals = players
  .filter(player => player.team?.id === teamId)
  .reduce((total, player) => total + Number(player.goals || 0), 0);

const totalAssists = players
  .filter(player => player.team?.id === teamId)
  .reduce((total, player) => total + Number(player.assists || 0), 0);

const totalPenalties = players
  .filter(player => player.team?.id === teamId)
  .reduce((total, player) => total + Number(player.penalties || 0), 0);
  const totalCards = players
  .filter(player => player.team?.id === teamId)
  .reduce((total, player) => total + Number(player.yellowCards || 0) + Number(player.redCards || 0) + Number(player.doubleYellowCards|| 0), 0);
  const renderTeamTotalsTable = () => (
    <div className="team-totals-table">
    
      <table>
        <thead>
          <tr>
            <th>Goals</th>
            <th>Assists</th>
            <th>Penalties</th>
            <th>Cards</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{totalGoals}</td>
            <td>{totalAssists}</td>
            <td>{totalPenalties}</td>
            <td>{totalCards}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="club-stats">
      {team && (
        <div className="team-stats-table">
          <h2>Leaders and general statistics of the {team.name}</h2>
          <h2> Games 2024-2025</h2>
          <table>
            <thead>
              <tr>
                <th> <PiSoccerBallFill className='icons'/> Matches Played</th>
                <th> <BsFillTrophyFill />Wins</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{team.matchesPlayed}</td>
                <td>{team.win}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {renderTeamTotalsTable()}
      <h2 className="leader-title">Leader of {team.name}</h2>
      <div className="grid-container">
        {renderRankings('shots', 'Shots')}
        {renderRankings('goals', 'Goals')}
        {renderRankings('assists', 'Assists')}
        {renderRankings('fouls', 'Fouls')}
        {renderRankings('redCards', 'Red Cards')}
        {renderRankings('yellowCards', 'Yellow Cards')}
        {renderRankings('doubleYellowCards', 'Double Yellow Cards')}
      </div>
      <div className="player-stats-table">
        {renderPlayerTable()}
      </div>
    </div>
  );
};

export default ClubStats;