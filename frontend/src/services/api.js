import axios from 'axios';

const api = axios.create({
  baseURL: 'https://police-grievance-portal-1bfk.onrender.com/api',
});

export default api;