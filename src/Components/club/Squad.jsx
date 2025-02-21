import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore } from '../firebaseConfig';
import { denormalizeTeamName } from '../../utils';
import { BsFillTrophyFill } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import './Squad.css';
import { normalizeTeamName } from '../../utils';
import insta from '../../assets/insta.png';

const Squad = () => {
  const { name } = useParams();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formattedName, setFormattedName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  const goalkeeperRef = useRef(null);
  const defenderRef = useRef(null);
  const midfielderRef = useRef(null);
  const forwardRef = useRef(null);
  const coachRef = useRef(null);
  const assistantCoachRef = useRef(null);
  const playerRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamAndPlayers = async () => {
      try {
        const formattedName = denormalizeTeamName(name);
        setFormattedName(formattedName);

        const teamSnapshot = await firestore.collection('teams').where('name', '==', formattedName).get();
        if (!teamSnapshot.empty) {
          const teamData = teamSnapshot.docs[0].data();
          teamData.trophies = teamData.trophies.split(',').map(trophy => trophy.trim());
          teamData.trophyYears = teamData.trophyYears.split(',').map(year => year.trim());
          setTeam(teamData);

          const playersSnapshot = await firestore.collection('teams').doc(teamSnapshot.docs[0].id).collection('players').get();
          const playersData = playersSnapshot.docs.map(doc => doc.data());
          setPlayers(playersData);
        } else {
          setTeam(null);
        }
      } catch (error) {
        console.error('Error fetching team and players data:', error);
        setTeam(null);
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamAndPlayers();
  }, [name]);

  const handleBack = () => {
    navigate(`/club/${normalizeTeamName(team.name)}`);
  };

  const categorizePlayers = (players) => {
    const filteredPlayers = players.filter(player =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categorized = {
      goalkeeper: [],
      defender: [],
      midfielder: [],
      forward: [],
      coach: [],
      assistantCoach: [],
    };

    filteredPlayers.forEach(player => {
      const role = player.role.toLowerCase();
      if (role.includes('goalkeeper')) {
        categorized.goalkeeper.push(player);
      } else if (role.includes('defender')) {
        categorized.defender.push(player);
      } else if (role.includes('midfielder')) {
        categorized.midfielder.push(player);
      } else if (role.includes('forward')) {
        categorized.forward.push(player);
      } else if (role.includes('coach') && !role.includes('assistant')) {
        categorized.coach.push(player);
      } else if (role.includes('assistant coach') || role.includes('technical coach') || role.includes('other')) {
        categorized.assistantCoach.push(player);
      }
    });

    return categorized;
  };

  const categorizedPlayers = categorizePlayers(players);

  const scrollToSection = (role) => {
    const refs = {
      goalkeeper: goalkeeperRef,
      defender: defenderRef,
      midfielder: midfielderRef,
      forward: forwardRef,
      coach: coachRef,
      assistantCoach: assistantCoachRef,
    };

    if (refs[role] && refs[role].current) {
      refs[role].current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      // Determine the player's role based on the search term
      const foundPlayer = players.find(player => player.name.toLowerCase() === searchTerm.toLowerCase());
      if (foundPlayer) {
        scrollToSection(foundPlayer.role.toLowerCase());
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!team) {
    return <div className="no-data">No team data available.</div>;
  }

  const handlePlayerClick = (playerName) => {
    navigate(`/player/${playerName}`);
  };

  return (
    <div className='page'>
      <div className="club-details-container">
        <div className="header">
          <img src={team.imageUrl} alt={team.name} className="team-image" />
          <h1 className="team-name">{team.name}</h1>
        </div>

        <div className="details-container">
          <div className="details-column">
            <p><strong>Foundation Year:</strong> {team.yearoffoundation}</p>
            <p><strong>President:</strong> {team.president}</p>
            <p><strong>Stadium:</strong> {team.stadium}</p>
            <button className='back' onClick={handleBack}>Back To Club</button>
          </div>

          <div className="details-column">
            <p><strong>Official Website:</strong> <a href={team.officialWeb} target="_blank" rel="noopener noreferrer">{team.officialWeb}</a></p>
            <div>
            <a href={team.instagram}><p><img src={insta} alt="" />Instagram</p> </a>
              <p><strong>Trophies:</strong></p>
              <ul>
                {team.trophies.length > 0 ? (
                  team.trophies.map((trophy, index) => (
                    <li key={index}>{trophy} <BsFillTrophyFill /></li>
                  ))
                ) : (
                  <li>No trophies data available</li>
                )}
              </ul>
            </div>
            <div>
              <p><strong>Trophy Years:</strong></p>
              <select>
                {team.trophyYears.length > 0 ? (
                  team.trophyYears.map((year, index) => (
                    <option key={index} value={year}>{year}</option>
                  ))
                ) : (
                  <option>No trophy years data available</option>
                )}
              </select>
            </div>
          </div>
        </div>
      </div>

      <h2 className='h2'>Squad of {team.name}</h2>
      <div className="search-container">
        {showSearchInput ? (
          <input
            type="text"
            placeholder="Search by player name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress} // Add onKeyPress handler here
            className="search-input"
          />
        ) : (
          <FaSearch className="search-icon" onClick={() => setShowSearchInput(true)} />
        )}
      </div>
      <div className="role-buttons">
        {['goalkeeper', 'defender', 'midfielder', 'forward', 'coach', 'assistantCoach'].map(role => (
          <button key={role} onClick={() => scrollToSection(role)} className="role-button">
            {role.charAt(0).toUpperCase() + role.slice(1)}s
          </button>
        ))}
      </div>

      {['goalkeeper', 'defender', 'midfielder', 'forward', 'coach', 'assistantCoach'].map(role => (
        <div key={role} className="players-section" ref={role === 'goalkeeper' ? goalkeeperRef : role === 'defender' ? defenderRef : role === 'midfielder' ? midfielderRef : role === 'forward' ? forwardRef : role === 'coach' ? coachRef : assistantCoachRef}>
          <h2 className='h2'>{role.charAt(0).toUpperCase() + role.slice(1)}s</h2>
          <div className="players-container">
            {categorizedPlayers[role].length > 0 ? (
              categorizedPlayers[role].map((player, index) => (
                <div key={index} className="player-card" onClick={() => handlePlayerClick(player.name)}>
                  <p className='playname'> <strong className='number'>{player.number}-</strong><strong>{player.name}</strong></p>
                  <img src={player.imageUrl} alt={player.name} className="player-image" />
                  <div className="player-info">
                    <p><strong>Role:</strong> {player.role}</p>
                    <p><strong>Date of Birth:</strong> {player.dateOfBirth}</p>
                    <p><strong>Place of Birth:</strong> {player.placeOfBirth}</p>
                    <p><strong>Height:</strong> {player.height}</p>
                    <p><strong>Weight:</strong> {player.weight}</p>
                    <p><strong>Goals:</strong> {player.goals}</p>
                    <p><strong>Assists:</strong> {player.assists}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No players available in this role.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Squad;
