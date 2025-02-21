import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../Theme"; 
import { mockDataTeam } from "../data/data";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../Header"; 
import Sidebar from '../Sidebar';
import '../Admin.css';
import { BsSearch } from 'react-icons/bs';
import { firestore } from '../../../Components/firebaseConfig';

const Team = () => {
  const handleButtonClick = (file) => {
    const filePath = `vscode://file/C:/Users/user/Desktop/fyp/fyp/src/Components/Admin/data/data.jsx`;
    window.open(filePath);
};
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "accessLevel",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              access === "admin"
                ? colors.greenAccent[600]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {access === "admin" && <AdminPanelSettingsOutlinedIcon />}
            {access === "advisor" && <SecurityOutlinedIcon />}
        
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {access}
            </Typography>
          </Box>
        );
      },
    },
  ];

  const filteredTeam = mockDataTeam.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box display="flex" flexDirection="row">
      <Box height="650px" width="250px"> 
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
          height="75vh"
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
          <button  className ="button" onClick={handleButtonClick}>Add Or Update Team Member</button>
          <DataGrid checkboxSelection rows={filteredTeam} columns={columns} />
        </Box>
      </Box>
    </Box>
  );
};

export default Team;