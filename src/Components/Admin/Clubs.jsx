import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { fetchTeams, addTeam, updateTeam, deleteTeam } from '../FetchTeams';
import Header from "./Header"; 
import Sidebar from './Sidebar';
import { BsSearch } from 'react-icons/bs';
import './Admin.css';
import { tokens } from "../../Theme";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore } from '../../Components/firebaseConfig';

const Clubs = () => {
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState({ 
    name: '', 
    imageUrl: '', 
    yearoffoundation: '', 
    history: '', 
    president: '', 
    stadium: '', 
    stadiumdescription: '',
    officialWeb: '', 
    season: '',
    trophies: '', 
    trophyYears: '', 
    matchesplayed: '',
    win:'',
    instagram: '', 
    imageUrlFile: null 
  });
  const [editTeam, setEditTeam] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [showTable, setShowTable] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const storage = getStorage();

  useEffect(() => {
    const getTeams = async () => {
      const teamsData = await fetchTeams();
      setTeams(teamsData);
    };

    getTeams();
  }, []);

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

  const handleAddTeam = async () => {
    if (newTeam.imageUrlFile) {
      const imageFile = newTeam.imageUrlFile;
      const storageRef = ref(storage, `team_images/${imageFile.name}`);
      
      try {
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);
        
        const teamData = { 
          name: newTeam.name, 
          imageUrl, 
          yearoffoundation: newTeam.yearoffoundation, 
          history: newTeam.history,
          president: newTeam.president,
          stadium: newTeam.stadium,
          stadiumdescription: newTeam.stadiumdescription,
          officialWeb: newTeam.officialWeb,
          season: newTeam.season,
          trophies: newTeam.trophies, 
          trophyYears: newTeam.trophyYears ,
          win: newTeam.win,
          instagram: newTeam.instagram,
          matchesplayed: newTeam.matchesplayed
        };
      
        await addTeam(teamData);
        
        setNewTeam({ 
          name: '', 
          imageUrl: '', 
          yearoffoundation: '', 
          history: '', 
          president: '', 
          stadium: '', 
          stadiumdescription: '',
          officialWeb: '', 
          season: '',
          trophies: '', 
          trophyYears: '', 
          matchesplayed :'',
          win: '',
          instagram: '',
          imageUrlFile: null 
        });
        
        const teamsData = await fetchTeams();
        setTeams(teamsData);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      console.warn('No file selected.');
    }
  };

  const handleUpdateTeam = async (teamId) => {
    if (editTeam.imageUrlFile) {
      const imageFile = editTeam.imageUrlFile;
      const storageRef = ref(storage, `team_images/${imageFile.name}`);

      try {
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);

        const updatedTeamData = { 
          ...editTeam, 
          imageUrl,
          trophies: editTeam.trophies, 
          trophyYears: editTeam.trophyYears 
        };
        await updateTeam(teamId, updatedTeamData);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      await updateTeam(teamId, editTeam);
    }

    setEditTeam(null);

    const teamsData = await fetchTeams();
    setTeams(teamsData);
  };

  const handleDeleteTeam = async (teamId) => {
    await deleteTeam(teamId);
    const teamsData = await fetchTeams();
    setTeams(teamsData);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageChange = (e, setTeamState) => {
    if (e.target.files[0]) {
      setTeamState(prevState => ({ ...prevState, imageUrlFile: e.target.files[0] }));
    }
  };

  return (
    <Box display="flex" flexDirection="row">
      <Box height="100%" width="600px"> 
        <Sidebar />
      </Box>
      
      <Box m="20px" flexGrow={1}>
        <Header  OpenSidebar={handleSidebarToggle} messageCount={messageCount} setMessageCount={setMessageCount}/>
        <Box display="flex" alignItems="center" mb="20px">
          <BsSearch className='icon' onClick={toggleSearch} />
          {isSearchVisible && (
            <input
              type="text"
              className='search-input'
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}
        </Box>

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
              color: colors.greenAccent[200] + ' !important',
            },
          }}
        >
          <Typography variant="h4" gutterBottom>
            Admin: Manage Teams
          </Typography>
          
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              Add New Team
            </Typography>
            <input 
              type="text" 
              placeholder="Team Name" 
              value={newTeam.name} 
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })} 
            />
            <input 
              type="text" 
              placeholder="Year of Foundation" 
              value={newTeam.yearoffoundation} 
              onChange={(e) => setNewTeam({ ...newTeam, yearoffoundation: e.target.value })} 
            />
            <textarea 
              placeholder="History" 
              value={newTeam.history} 
              onChange={(e) => setNewTeam({ ...newTeam, history: e.target.value })} 
            />
            <input 
              type="text" 
              placeholder="President" 
              value={newTeam.president} 
              onChange={(e) => setNewTeam({ ...newTeam, president: e.target.value })} 
            />
            <input 
              type="text" 
              placeholder="Stadium" 
              value={newTeam.stadium} 
              onChange={(e) => setNewTeam({ ...newTeam, stadium: e.target.value })} 
            />
             <input 
              type="text" 
              placeholder="Stadium Description" 
              value={newTeam.stadiumdescription} 
              onChange={(e) => setNewTeam({ ...newTeam, stadiumdescription: e.target.value })} 
            />
            <input 
              type="text" 
              placeholder="Official Website" 
              value={newTeam.officialWeb} 
              onChange={(e) => setNewTeam({ ...newTeam, officialWeb: e.target.value })} 
            />
            <input 
              type="text" 
              placeholder="Instagram Link" 
              value={newTeam.instagram} 
              onChange={(e) => setNewTeam({ ...newTeam, instagram: e.target.value })} 
            />
            <input 
              type="text" 
              placeholder="Season" 
              value={newTeam.season} 
              onChange={(e) => setNewTeam({ ...newTeam, season: e.target.value })} 
            />
             <input 
              type="text" 
              placeholder="MtchesPlayed" 
              value={newTeam.matchesplayed} 
              onChange={(e) => setNewTeam({ ...newTeam, matchesplayed: e.target.value })} 
            />
             <input 
              type="text" 
              placeholder="Wins" 
              value={newTeam.win} 
              onChange={(e) => setNewTeam({ ...newTeam, win: e.target.value })} 
            />
            <input 
              type="text" 
              placeholder="Number of Trophies" 
              value={newTeam.trophies} 
              onChange={(e) => setNewTeam({ ...newTeam, trophies: e.target.value })} 
            />
            <input 
              type="text" 
              placeholder="Years Won (comma-separated)" 
              value={newTeam.trophyYears} 
              onChange={(e) => setNewTeam({ ...newTeam, trophyYears: e.target.value })} 
            />
            <input 
              type="file" 
              onChange={(e) => handleImageChange(e, setNewTeam)} 
            />
            <button onClick={handleAddTeam}>Add Team</button>
            <button onClick={() => setShowTable(true)}>Display All Teams</button>
          </Box>

          {showTable && (
            <>
              <Typography variant="h6" gutterBottom>
                Teams
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Image</TableCell>
                      <TableCell>Year of Foundation</TableCell>
                      <TableCell>President</TableCell>
                      <TableCell>Stadium</TableCell>
                      <TableCell>Official Website</TableCell>
                      <TableCell>Instagram</TableCell>
                      <TableCell>Season</TableCell>
                      <TableCell>Trophies</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTeams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell>{team.name}</TableCell>
                        <TableCell>
                          <img src={team.imageUrl} alt={team.name} width={100} />
                        </TableCell>
                        <TableCell>{team.yearoffoundation}</TableCell>
                        
                        <TableCell>{team.president}</TableCell>
                        <TableCell>{team.stadium}</TableCell>
                        <TableCell>
                          <a href={team.officialWeb} target="_blank" rel="noopener noreferrer">
                            {team.officialWeb}
                          </a>
                        </TableCell>
                        <TableCell>
                          <a href={team.instagram} target="_blank" rel="noopener noreferrer">
                            {team.instagram}
                          </a>
                        </TableCell>
                        <TableCell>{team.season}</TableCell>
                        <TableCell>{team.trophies}</TableCell>
                        <TableCell>
                          <button onClick={() => setEditTeam(team)}>Edit</button>
                          <button onClick={() => handleDeleteTeam(team.id)}>Delete</button>
                          <button onClick={() => navigate(`/admin/clubs/${team.id}/players`)}>Manage Players</button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {editTeam && (
            <Box mt={2}>
              <Typography variant="h6" gutterBottom>Edit Team</Typography>
              <TextField
                label="Team Name"
                value={editTeam.name}
                onChange={(e) => setEditTeam({ ...editTeam, name: e.target.value })}
                fullWidth
                multiline
                margin="normal"
              />
              <TextField
                label="Year of Foundation"
                value={editTeam.yearoffoundation}
                onChange={(e) => setEditTeam({ ...editTeam, yearoffoundation: e.target.value })}
                fullWidth
                multiline
                margin="normal"
              />
              <TextField
                label="History"
                value={editTeam.history}
                onChange={(e) => setEditTeam({ ...editTeam, history: e.target.value })}
                fullWidth
                multiline
                rows={4}
                margin="normal"
              />
              <TextField
                label="President"
                value={editTeam.president}
                onChange={(e) => setEditTeam({ ...editTeam, president: e.target.value })}
                fullWidth
                multiline
                margin="normal"
              />
              <TextField
                label="Stadium"
                value={editTeam.stadium}
                onChange={(e) => setEditTeam({ ...editTeam, stadium: e.target.value })}
                fullWidth
                multiline
                margin="normal"
              />
               <TextField
                label="Stadium Description"
                value={editTeam.stadiumdescription}
                onChange={(e) => setEditTeam({ ...editTeam, stadiumdescription: e.target.value })}
                fullWidth
                multiline
                margin="normal"
              />
              <TextField
                label="Official Website"
                value={editTeam.officialWeb}
                onChange={(e) => setEditTeam({ ...editTeam, officialWeb: e.target.value })}
                fullWidth
                multiline
                margin="normal"
              />
              <TextField
                label="Instagram"
                value={editTeam.instagram}
                onChange={(e) => setEditTeam({ ...editTeam, instagram: e.target.value })}
                fullWidth
                multiline
                margin="normal"
              />
              <TextField
                label="Season"
                value={editTeam.season}
                onChange={(e) => setEditTeam({ ...editTeam, season: e.target.value })}
                fullWidth
                multiline
                margin="normal"
              />
               <TextField
                label="MtchesPlayed"
                value={editTeam.matchesplayed}
                onChange={(e) => setEditTeam({ ...editTeam, matchesplayed: e.target.value })}
                fullWidth
                multiline
                margin="normal"
              />
                <TextField
                label="Wins"
                value={editTeam.win}
                onChange={(e) => setEditTeam({ ...editTeam, win: e.target.value })}
                fullWidth
                multiline
                margin="normal"
              />
              <TextField
                label="Number of Trophies"
                value={editTeam.trophies}
                onChange={(e) => setEditTeam({ ...editTeam, trophies: e.target.value })}
                fullWidth
                multiline
                margin="normal"
              />
              <TextField
                label="Years Won (comma-separated)"
                value={editTeam.trophyYears}
                onChange={(e) => setEditTeam({ ...editTeam, trophyYears: e.target.value })}
                fullWidth
                multiline
                margin="normal"
              />
              <input
                type="file"
                onChange={(e) => handleImageChange(e, setEditTeam)}
              />
              <button onClick={() => handleUpdateTeam(editTeam.id)}>Update Team</button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Clubs;