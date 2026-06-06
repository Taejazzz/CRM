import axios from 'axios';

// Dynamically use backend environment URL, defaulting to local port 5000
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
export { BACKEND_URL };
