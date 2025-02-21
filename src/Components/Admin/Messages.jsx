import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../Theme';
import Sidebar from './Sidebar';
import Header from './Header';
import { firestore } from '../../Components/firebaseConfig';
import { BsSearch } from 'react-icons/bs';
import './Admin.css';


const Messages = ({ setMessageCount, messageCount }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch messages from Firestore
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesCollection = firestore.collection('messages');
        const messagesSnapshot = await messagesCollection.get();
        const messagesList = messagesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(messagesList);
      } catch (error) {
        console.error("Error fetching messages: ", error);
      }
    };

    fetchMessages();
  }, []);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleView = async (id) => {
    try {
      await firestore.collection('messages').doc(id).delete();
      setData(data.filter((item) => item.id !== id));
      setMessageCount(prevCount => Math.max(prevCount - 1, 0));
    } catch (err) {
      console.log(err);
    }
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const filteredMessages = data.filter((message) =>
    message.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'message', headerName: 'Message', flex: 2 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => {
        return (
          <button className="viewButton" onClick={() => handleView(params.row.id)}>
            Delete
          </button>
        );
      },
    },
  ];

  const rows = filteredMessages.map((message) => ({
    id: message.id,
    name: message.name || 'N/A',
    email: message.email || 'N/A',
    message: message.message || 'N/A',
  }));

  return (
    <Box display="flex" flexDirection="row">
      <Box height="650px" width="250px">
        <Sidebar />
      </Box>
      <Box m="20px" flexGrow={1}>
        <Header OpenSidebar={handleSidebarToggle} messageCount={messageCount} setMessageCount={setMessageCount} />
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

export default Messages;