const DB_URL = 'www.block-dj.com/api'

export const getUser = (userID) => fetch(`${DB_URL}/`);

export const getUserPlaylists = (userID) => fetch(`${DB_URL}/`);

export const getCities = () => fetch(`${DB_URL}/`);

export const getAreasByCity = (cityID) => fetch(`${DB_URL}/`);

export const getAreaPlaylists = (areaID) => fetch(`${DB_URL}/`);

export const postPlaylist = (areaID, playlist) => fetch(`${DB_URL}/`, { method: 'POST' });