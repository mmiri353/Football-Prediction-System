import React, { useEffect, useState } from 'react';
import { fetchTeams } from '../FetchTeams';
import { Link } from 'react-router-dom';
import { IoIosArrowDroprightCircle } from 'react-icons/io';
import './Club.css';
import { useTeam } from '../../TeamContext';
import { normalizeTeamName } from '../../utils';

const Club = () => {
  const [teams, setTeams] = useState([]);
  const { setSelectedTeam } = useTeam();

  useEffect(() => {
    const getTeams = async () => {
      try {
        const teamsData = await fetchTeams();
        console.log('Fetched teams data:', teamsData);

        
        teamsData.forEach(team => {
          console.log(`Team name (type: ${typeof team.name}):`, team.name);
        });

       
        const sortedTeams = teamsData.sort((a, b) => {
          const nameA = (a.name || '').trim().toLowerCase();
          const nameB = (b.name || '').trim().toLowerCase();
          const comparison = nameA.localeCompare(nameB, 'en', { sensitivity: 'base' });
          console.log(`Comparing "${a.name}" with "${b.name}":`, comparison);
          return comparison;
        });

        console.log('Sorted teams data:', sortedTeams);
        setTeams(sortedTeams);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    getTeams();
  }, []);

  const handleTeamClick = (team) => {
    console.log('Setting selected team:', team);
    setSelectedTeam(team);
  };

  return (
    <div className="club-container">
      <h1>Club Teams</h1>
      <div className="teams-container">
        {teams.map((team) => (
          <div key={team.id} className="team-card">
            <h2>{team.name}</h2>
            <img src={team.imageUrl} alt={team.name} className="imgclub" />
            <p className='clubp'>FOUNDATION {team.yearoffoundation}</p>
            <Link
              to={`/club/${normalizeTeamName(team.name)}`}
              className="club-details-link"
              onClick={() => handleTeamClick(team)}
            >
              See Club Details <IoIosArrowDroprightCircle />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Club;