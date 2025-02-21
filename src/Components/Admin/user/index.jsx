import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../../Theme';
import { auth } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Header from '../Header';
import Sidebar from '../Sidebar';
import '../Admin.css';
import { BsSearch } from 'react-icons/bs';
import { firestore } from '../../../Components/firebaseConfig';

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsers((prevUsers) => [...prevUsers, user]);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };
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

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { field: 'uid', headerName: 'UID', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'displayName', headerName: 'Display Name', flex: 1 },
  ];

  const rows = filteredUsers.map((user) => ({
    id: user.uid,
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || 'N/A',
  }));

  return (
    <Box display="flex" flexDirection="row">
      <Box height="100%" width="250px">
        <Sidebar />
      </Box>
      <Box m="20px" flexGrow={1}>
        <Header OpenSidebar={handleSidebarToggle} messageCount={messageCount} setMessageCount={setMessageCount}/>
        <Box display="flex" alignItems="center" mb="20px">
          <BsSearch className='icon' onClick={toggleSearch} />
          {isSearchVisible && (
            <input
              type="text"
              className='search-input'
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}
        </Box>
        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            '& .MuiDataGrid-root': {
              border: 'none',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: 'none',
            },
            '& .name-column--cell': {
              color: colors.greenAccent[300],
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: colors.blueAccent[700],
              borderBottom: 'none',
            },
            '& .MuiDataGrid-virtualScroller': {
              backgroundColor: colors.primary[400],
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: 'none',
              backgroundColor: colors.blueAccent[700],
            },
            '& .MuiCheckbox-root': {
              color: `${colors.greenAccent[200]} !important`,
            },
          }}
        >
          <DataGrid rows={rows} columns={columns} checkboxSelection />
        </Box>
      </Box>
    </Box>
  );
};

export default Users;