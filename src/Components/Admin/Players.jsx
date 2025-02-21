import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles'; 
import { addPlayer, updatePlayer, deletePlayer, fetchTeams } from '../FetchTeams';
import Header from "./Header"; 
import Sidebar from './Sidebar';
import './Admin.css';
import { tokens } from "../../Theme";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore } from '../../Components/firebaseConfig';

const Players = () => {
  const { teamId } = useParams();
   
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [team, setTeam] = useState(null);
  const [newPlayer, setNewPlayer] = useState({
    name: '', number: '', imageUrl: '', imageUrlFile: null, role: '', dateOfBirth: '', placeOfBirth: '', height: '', weight: '',
    goals: '', assists: '', shots: '', matchesPlayed: '', minutes: '', starts: '', substitutions: '', fouls: '',
    penalties: '', yellowCards: '', redCards: '', doubleYellowCards: '', keepCatches: '', keepBlocks: '', penaltiesBlocked: ''
  });
  const [editPlayer, setEditPlayer] = useState(null);
  const [showPlayers, setShowPlayers] = useState(false); 
  const [messageCount, setMessageCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const storage = getStorage();

  useEffect(() => {
    const getTeams = async () => {
      const teamsData = await fetchTeams();
      const selectedTeam = teamsData.find((team) => team.id === teamId);
      setTeam(selectedTeam);
      setPlayers(selectedTeam.players);
    };

    getTeams();
  }, [teamId]);

  useEffect(() => {
    const fetchMessageCount = async () => {
      const snapshot = await firestore.collection('messages').get();
      setMessageCount(snapshot.size);
    };

    fetchMessageCount();
  }, [setMessageCount]);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAddPlayer = async () => {
    if (newPlayer.imageUrlFile) {
      const imageFile = newPlayer.imageUrlFile;
      const storageRef = ref(storage, `player_images/${imageFile.name}`);

      try {
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);

        const playerData = { ...newPlayer, imageUrl };
        delete playerData.imageUrlFile;

        await addPlayer(teamId, playerData);

        setNewPlayer({
          name: '', number: '', imageUrl: '', imageUrlFile: null, role: '', dateOfBirth: '', placeOfBirth: '', height: '', weight: '',
          goals: '', assists: '', shots: '', matchesPlayed: '', minutes: '', starts: '', substitutions: '', fouls: '',
          penalties: '', yellowCards: '', redCards: '', doubleYellowCards: '', keepCatches: '', keepBlocks: '', penaltiesBlocked: ''
        });

        const teamsData = await fetchTeams();
        const selectedTeam = teamsData.find((team) => team.id === teamId);
        setPlayers(selectedTeam.players);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      console.warn('No file selected.');
    }
  };

  const handleUpdatePlayer = async (playerId) => {
    if (editPlayer.imageUrlFile) {
      const imageFile = editPlayer.imageUrlFile;
      const storageRef = ref(storage, `player_images/${imageFile.name}`);

      try {
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);

        const updatedPlayerData = { ...editPlayer, imageUrl };
        delete updatedPlayerData.imageUrlFile;
        await updatePlayer(teamId, playerId, updatedPlayerData);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      await updatePlayer(teamId, playerId, editPlayer);
    }

    setEditPlayer(null);

    const teamsData = await fetchTeams();
    const selectedTeam = teamsData.find((team) => team.id === teamId);
    setPlayers(selectedTeam.players);
  };

  const handleDeletePlayer = async (playerId) => {
    await deletePlayer(teamId, playerId);
    const teamsData = await fetchTeams();
    const selectedTeam = teamsData.find((team) => team.id === teamId);
    setPlayers(selectedTeam.players);
  };

  const handleImageChange = (e, setPlayerState) => {
    if (e.target.files[0]) {
      setPlayerState(prevState => ({ ...prevState, imageUrlFile: e.target.files[0] }));
    }
  };

  const handleTogglePlayers = () => {
    setShowPlayers(!showPlayers);
  };

  return (
    <Box display="flex" flexDirection="row">
      <Box height="100%" width="950px"> 
        <Sidebar />
      </Box>
      
      <Box m="20px" flexGrow={1}>
        <Header OpenSidebar={handleSidebarToggle} messageCount={messageCount} setMessageCount={setMessageCount}/>
        
        <Box
          m="40px 0 0 0"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
          }}
        >
          <Typography variant="h4" gutterBottom>
            Manage Players for {team?.name}
          </Typography>
          
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              Add New Player
            </Typography>
            <input 
              type="text" 
              placeholder="Player Name" 
              value={newPlayer.name} 
              onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })} 
            />
            <input 
              type="text" 
              placeholder="Player Number" 
              value={newPlayer.number} 
              onChange={(e) => setNewPlayer({ ...newPlayer, number: e.target.value })} 
            />
            <input 
              type="text" 
              placeholder="Role" 
              value={newPlayer.role} 
              onChange={(e) => setNewPlayer({ ...newPlayer, role: e.target.value })} 
            />
            <input 
              type="date" 
              placeholder="Date of Birth" 
              value={newPlayer.dateOfBirth} 
              onChange={(e) => setNewPlayer({ ...newPlayer, dateOfBirth: e.target.value })} 
            />
            <input 
              type="text" 
              placeholder="Place of Birth" 
              value={newPlayer.placeOfBirth} 
              onChange={(e) => setNewPlayer({ ...newPlayer, placeOfBirth: e.target.value })} 
            />
            <input 
              type="text" 
              placeholder="Height (cm)" 
              value={newPlayer.height} 
              onChange={(e) => setNewPlayer({ ...newPlayer, height: e.target.value })} 
            />
            <input 
              type="text" 
              placeholder="Weight (kg)" 
              value={newPlayer.weight} 
              onChange={(e) => setNewPlayer({ ...newPlayer, weight: e.target.value })} 
            />
            <input 
              type="number" 
              placeholder="Goals" 
              value={newPlayer.goals} 
              onChange={(e) => setNewPlayer({ ...newPlayer, goals: e.target.value })} 
            />
            <input 
              type="number" 
              placeholder="Assists" 
              value={newPlayer.assists} 
              onChange={(e) => setNewPlayer({ ...newPlayer, assists: e.target.value })} 
            />
            <input 
              type="number" 
              placeholder="Shots" 
              value={newPlayer.shots} 
              onChange={(e) => setNewPlayer({ ...newPlayer, shots: e.target.value })} 
            />
            <input 
              type="number" 
              placeholder="Matches Played" 
              value={newPlayer.matchesPlayed} 
              onChange={(e) => setNewPlayer({ ...newPlayer, matchesPlayed: e.target.value })} 
            />
            <input 
              type="number" 
              placeholder="Minutes" 
              value={newPlayer.minutes} 
              onChange={(e) => setNewPlayer({ ...newPlayer, minutes: e.target.value })} 
            />
            <input 
              type="number" 
              placeholder="Starts" 
              value={newPlayer.starts} 
              onChange={(e) => setNewPlayer({ ...newPlayer, starts: e.target.value })} 
            />
            <input 
              type="number" 
              placeholder="Substitutions" 
              value={newPlayer.substitutions} 
              onChange={(e) => setNewPlayer({ ...newPlayer, substitutions: e.target.value })} 
            />
            <input 
              type="number" 
              placeholder="Fouls" 
              value={newPlayer.fouls} 
              onChange={(e) => setNewPlayer({ ...newPlayer, fouls: e.target.value })} 
            />
            <input 
              type="number" 
              placeholder="Penalties" 
              value={newPlayer.penalties} 
              onChange={(e) => setNewPlayer({ ...newPlayer, penalties: e.target.value })} 
            />
            <input 
              type="number" 
              placeholder="Yellow Cards" 
              value={newPlayer.yellowCards} 
              onChange={(e) => setNewPlayer({ ...newPlayer, yellowCards: e.target.value })} 
            />
            <input 
              type="number" 
              placeholder="Red Cards" 
              value={newPlayer.redCards} 
              onChange={(e) => setNewPlayer({ ...newPlayer, redCards: e.target.value })} 
            />
            <input 
              type="number" 
              placeholder="Double Yellow Cards" 
              value={newPlayer.doubleYellowCards} 
              onChange={(e) => setNewPlayer({ ...newPlayer, doubleYellowCards: e.target.value })} 
            />
            <input 
              type="number" 
              placeholder="Fouls Committed" 
              value={newPlayer.foulsCommitted} 
              onChange={(e) => setNewPlayer({ ...newPlayer, foulsCommitted: e.target.value })} 
            />
            <input 
              type="number" 
              placeholder="Penalties Received" 
              value={newPlayer.penaltiesReceived} 
              onChange={(e) => setNewPlayer({ ...newPlayer, penaltiesReceived: e.target.value })} 
            />
            <input 
              type="number" 
              placeholder="Keep Catches" 
              value={newPlayer.keepCatches} 
              onChange={(e) => setNewPlayer({ ...newPlayer, keepCatches: e.target.value })} 
            />
            <input 
              type="number" 
              placeholder="Keep Blocks" 
              value={newPlayer.keepBlocks} 
              onChange={(e) => setNewPlayer({ ...newPlayer, keepBlocks: e.target.value })} 
            />
            <input 
              type="number" 
              placeholder="Penalties Blocked" 
              value={newPlayer.penaltiesBlocked} 
              onChange={(e) => setNewPlayer({ ...newPlayer, penaltiesBlocked: e.target.value })} 
            />
            <br />
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleImageChange(e, setNewPlayer)} 
            />
            <button onClick={handleAddPlayer}>Add Player</button>
          </Box>

          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              Edit Player
            </Typography>
            {editPlayer && (
              <>
                <input 
                  type="text" 
                  placeholder="Player Name" 
                  value={editPlayer.name} 
                  onChange={(e) => setEditPlayer({ ...editPlayer, name: e.target.value })} 
                />
                <input 
                  type="text" 
                  placeholder="Player Number" 
                  value={editPlayer.number} 
                  onChange={(e) => setEditPlayer({ ...editPlayer, number: e.target.value })} 
                />
                <input 
                  type="text" 
                  placeholder="Role" 
                  value={editPlayer.role} 
                  onChange={(e) => setEditPlayer({ ...editPlayer, role: e.target.value })} 
                />
                <input 
                  type="date" 
                  placeholder="Date of Birth" 
                  value={editPlayer.dateOfBirth} 
                  onChange={(e) => setEditPlayer({ ...editPlayer, dateOfBirth: e.target.value })} 
                />
                <input 
                  type="text" 
                  placeholder="Place of Birth" 
                  value={editPlayer.placeOfBirth} 
                  onChange={(e) => setEditPlayer({ ...editPlayer, placeOfBirth: e.target.value })} 
                />
                <input 
                  type="text" 
                  placeholder="Height (cm)" 
                  value={editPlayer.height} 
                  onChange={(e) => setEditPlayer({ ...editPlayer, height: e.target.value })} 
                />
                <input 
                  type="text" 
                  placeholder="Weight (kg)" 
                  value={editPlayer.weight} 
                  onChange={(e) => setEditPlayer({ ...editPlayer, weight: e.target.value })} 
                />
                <input 
                  type="number" 
                  placeholder="Goals" 
                  value={editPlayer.goals} 
                  onChange={(e) => setEditPlayer({ ...editPlayer, goals: e.target.value })} 
                />
                <input 
                  type="number" 
                  placeholder="Assists" 
                  value={editPlayer.assists} 
                  onChange={(e) => setEditPlayer({ ...editPlayer, assists: e.target.value })} 
                />
                <input 
                  type="number" 
                  placeholder="Shots" 
                  value={editPlayer.shots} 
                  onChange={(e) => setEditPlayer({ ...editPlayer, shots: e.target.value })} 
                />
                <input 
                  type="number" 
                  placeholder="Matches Played" 
                  value={editPlayer.matchesPlayed} 
                  onChange={(e) => setEditPlayer({ ...editPlayer, matchesPlayed: e.target.value })} 
                />
                <input 
                  type="number" 
                  placeholder="Minutes" 
                  value={editPlayer.minutes} 
                  onChange={(e) => setEditPlayer({ ...editPlayer, minutes: e.target.value })} 
                />
                <input 
                  type="number" 
                  placeholder="Starts" 
                  value={editPlayer.starts} 
                  onChange={(e) => setEditPlayer({ ...editPlayer, starts: e.target.value })} 
                />
                <input 
                  type="number" 
                  placeholder="Substitutions" 
                  value={editPlayer.substitutions} 
                  onChange={(e) => setEditPlayer({ ...editPlayer, substitutions: e.target.value })} 
                />
                <input 
                  type="number" 
                  placeholder="Fouls" 
                  value={editPlayer.fouls} 
                  onChange={(e) => setEditPlayer({ ...editPlayer, fouls: e.target.value })} 
                />
                <input 
                  type="number" 
                  placeholder="Penalties" 
                  value={editPlayer.penalties} 
                  onChange={(e) => setEditPlayer({ ...editPlayer, penalties: e.target.value })} 
                />
                <input 
                  type="number" 
                  placeholder="Yellow Cards" 
                  value={editPlayer.yellowCards} 
                  onChange={(e) => setEditPlayer({ ...editPlayer, yellowCards: e.target.value })} 
                />
                <input 
                  type="number" 
                  placeholder="Red Cards" 
                  value={editPlayer.redCards} 
                  onChange={(e) => setEditPlayer({ ...editPlayer, redCards: e.target.value })} 
                />
                <input 
                  type="number" 
                  placeholder="Double Yellow Cards" 
                  value={editPlayer.doubleYellowCards} 
                  onChange={(e) => setEditPlayer({ ...editPlayer, doubleYellowCards: e.target.value })} 
                />
                <input 
                  type="number" 
                  placeholder="Fouls Committed" 
                  value={editPlayer.foulsCommitted} 
                  onChange={(e) => setEditPlayer({ ...editPlayer, foulsCommitted: e.target.value })} 
                />
                <input 
                  type="number" 
                  placeholder="Penalties Received" 
                  value={editPlayer.penaltiesReceived} 
                  onChange={(e) => setEditPlayer({ ...editPlayer, penaltiesReceived: e.target.value })} 
                />
                <input 
                  type="number" 
                  placeholder="Keep Catches" 
                  value={editPlayer.keepCatches} 
                  onChange={(e) => setEditPlayer({ ...editPlayer, keepCatches: e.target.value })} 
                />
                <input 
                  type="number" 
                  placeholder="Keep Blocks" 
                  value={editPlayer.keepBlocks} 
                  onChange={(e) => setEditPlayer({ ...editPlayer, keepBlocks: e.target.value })} 
                />
                <input 
                  type="number" 
                  placeholder="Penalties Blocked" 
                  value={editPlayer.penaltiesBlocked} 
                  onChange={(e) => setEditPlayer({ ...editPlayer, penaltiesBlocked: e.target.value })} 
                />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleImageChange(e, setEditPlayer)} 
                />
                <button onClick={() => handleUpdatePlayer(editPlayer.id)}>Update Player</button>
                <button onClick={() => setEditPlayer(null)}>Cancel</button>
              </>
            )}
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Players List
            </Typography>
            <button onClick={handleTogglePlayers}>
              {showPlayers ? 'Hide Players' : 'Show Players'}
            </button>

            {showPlayers && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Number</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Date of Birth</TableCell>
                      <TableCell>Place of Birth</TableCell>
                      <TableCell>Height</TableCell>
                      <TableCell>Weight</TableCell>
                      <TableCell>Goals</TableCell>
                      <TableCell>Assists</TableCell>
                      <TableCell>Shots</TableCell>
                      <TableCell>Matches Played</TableCell>
                      <TableCell>Minutes</TableCell>
                      <TableCell>Starts</TableCell>
                      <TableCell>Substitutions</TableCell>
                      <TableCell>Fouls</TableCell>
                      <TableCell>Penalties</TableCell>
                      <TableCell>Yellow Cards</TableCell>
                      <TableCell>Red Cards</TableCell>
                      <TableCell>Double Yellow Cards</TableCell>
                      <TableCell>Fouls Committed</TableCell>
                      <TableCell>Penalties Received</TableCell>
                      <TableCell>Keep Catches</TableCell>
                      <TableCell>Keep Blocks</TableCell>
                      <TableCell>Penalties Blocked</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {players.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell>{player.name}</TableCell>
                        <TableCell>{player.number}</TableCell>
                        <TableCell>{player.role}</TableCell>
                        <TableCell>{player.dateOfBirth}</TableCell>
                        <TableCell>{player.placeOfBirth}</TableCell>
                        <TableCell>{player.height}</TableCell>
                        <TableCell>{player.weight}</TableCell>
                        <TableCell>{player.goals}</TableCell>
                        <TableCell>{player.assists}</TableCell>
                        <TableCell>{player.shots}</TableCell>
                        <TableCell>{player.matchesPlayed}</TableCell>
                        <TableCell>{player.minutes}</TableCell>
                        <TableCell>{player.starts}</TableCell>
                        <TableCell>{player.substitutions}</TableCell>
                        <TableCell>{player.fouls}</TableCell>
                        <TableCell>{player.penalties}</TableCell>
                        <TableCell>{player.yellowCards}</TableCell>
                        <TableCell>{player.redCards}</TableCell>
                        <TableCell>{player.doubleYellowCards}</TableCell>
                        <TableCell>{player.foulsCommitted}</TableCell>
                        <TableCell>{player.penaltiesReceived}</TableCell>
                        <TableCell>{player.keepCatches}</TableCell>
                        <TableCell>{player.keepBlocks}</TableCell>
                        <TableCell>{player.penaltiesBlocked}</TableCell>
                        <TableCell>
                          <button onClick={() => setEditPlayer(player)}>Edit</button>
                          <button onClick={() => handleDeletePlayer(player.id)}>Delete</button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Players;