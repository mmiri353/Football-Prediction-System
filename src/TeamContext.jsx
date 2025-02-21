import React, { createContext, useContext, useState } from 'react';

const TeamContext = createContext();

export const useTeam = () => useContext(TeamContext);

export const TeamProvider = ({ children }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);

  return (
    <TeamContext.Provider value={{ selectedTeam, setSelectedTeam }}>
      {children}
    </TeamContext.Provider>
  );
};