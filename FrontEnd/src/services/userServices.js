// import api from './api';
import api from "../api";
export const userService = {
  
  login: (credentials) => {
    return api.post('/login', credentials);
  },
  signup: (userData) => {
    return api.post('/signup', userData);
  },
  logout: () => {
    return api.post('/logoutUser');
  }
};