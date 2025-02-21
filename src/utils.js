export const normalizeTeamName = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-');
};
  
  export const denormalizeTeamName = (urlName) => {
    return urlName.replace(/-/g, ' ').toUpperCase();
  };