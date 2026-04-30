import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)
export const getRooms = () => API.get('/rooms/')
export const createRoom = (data) => API.post('/rooms/', data)
export const deleteRoom = (id) => API.delete(`/rooms/${id}`)
export const getDevices = () => API.get('/devices/')
export const getDevicesByRoom = (roomId) => API.get(`/devices/room/${roomId}`)
export const createDevice = (data) => API.post('/devices/', data)
export const controlDevice = (id, data) => API.patch(`/devices/${id}/control`, data)
export const deleteDevice = (id) => API.delete(`/devices/${id}`)
export const getLogs = () => API.get('/logs/')
export const createSchedule = (data) => API.post('/schedules/', data)
export const getSchedules = () => API.get('/schedules/')
export const createGuest = (data) => API.post('/guests/', data)
