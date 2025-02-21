import React, { createContext, useContext, useState } from 'react';

const EventsContext = createContext();

export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  const addEvent = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const deleteEvent = (eventId) => {
    setEvents((prevEvents) => prevEvents.filter(event => event.id !== eventId));
  };

  return (
    <EventsContext.Provider value={{ events, addEvent, deleteEvent }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  return useContext(EventsContext);
};