import axios from 'axios';

// Correctly reads the Render environment variable
const BASE_URL = import.meta.env.VITE_API_URL || "https://homeiq-5av2.onrender.com";

const api = axios.create({
    baseURL: BASE_URL,
});

// CRITICAL: This sends your token to the backend automatically after login[cite: 1]
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const registerUser = (userData) => api.post(`/auth/register`, userData);
export const loginUser = (data) => api.post(`/auth/login`, data);
export const getRooms = () => api.get(`/rooms/`);
export const createRoom = (data) => api.post(`/rooms/`, data);
export const deleteRoom = (id) => api.delete(`/rooms/${id}`);
export const getDevices = () => api.get(`/devices/`);
export const getDevicesByRoom = (roomId) => api.get(`/devices/room/${roomId}`);
export const createDevice = (data) => api.post(`/devices/`, data);
export const controlDevice = (id, data) => api.patch(`/devices/${id}/control`, data);
export const deleteDevice = (id) => api.delete(`/devices/${id}`);
export const getLogs = () => api.get(`/logs/`);
export const createSchedule = (data) => api.post(`/schedules/`, data);
export const getSchedules = () => api.get(`/schedules/`);
export const createGuest = (data) => api.post(`/guests/`, data);

export default api;