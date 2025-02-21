import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { formatDate } from "@fullcalendar/core";
import { Box, List, ListItem, ListItemText, Typography, useTheme } from "@mui/material";
import Header from "../Header";
import { tokens } from "../../../Theme";
import Sidebar from '../Sidebar';
import { useEvents } from "./EventsContext";
import { firestore } from '../../../Components/firebaseConfig';
import '.././Admin.css';

const Calendar = () => {
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
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { events, addEvent, deleteEvent } = useEvents();

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handleDateClick = (selected) => {
    const title = prompt("Please enter a new title for your event");
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();

    if (title) {
      const newEvent = {
        id: `${selected.dateStr}-${title}-${new Date().getTime()}`,
        title,
        start: selected.startStr,
        end: selected.endStr,
        allDay: selected.allDay,
      };
      calendarApi.addEvent(newEvent);
      addEvent(newEvent);
    }
  };

  const handleEventClick = (selected) => {
    if (window.confirm(`Are you sure you want to delete the event '${selected.event.title}'`)) {
      selected.event.remove();
      deleteEvent(selected.event.id);
    }
  };

  return (
    <Box display="flex" flexDirection="row">
      <Box height="650px" width="200px">
        <Sidebar />
      </Box>
      <Box m="20px" flexGrow={1}>
        <Header OpenSidebar={handleSidebarToggle} messageCount={messageCount} setMessageCount={setMessageCount}/>
        <Box display="flex" justifyContent="space-between">
          <Box
            flex="1 1 20%"
            backgroundColor={colors.primary[400]}
            p="15px"
            borderRadius="4px"
          >
            <Typography variant="h5">Events</Typography>
            <List>
              {events.map((event) => (
                <ListItem
                  key={event.id}
                  sx={{
                    backgroundColor: colors.greenAccent[500],
                    margin: "10px 0",
                    borderRadius: "2px",
                  }}
                >
                  <ListItemText
                    primary={event.title}
                    secondary={
                      <Typography>
                        {formatDate(event.start, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
          <Box flex="1 1 100%" ml="15px">
            <FullCalendar
              height="75vh"
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                listPlugin,
              ]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
              }}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              select={handleDateClick}
              eventClick={handleEventClick}
              events={events}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;