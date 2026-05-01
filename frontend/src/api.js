import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || "https://homeiq-5av2.onrender.com";

export const registerUser = async (userData) => {
    return await axios.post(`${BASE_URL}/auth/register`, userData);
}
export const loginUser = async (data) => {
    return await axios.post(`${BASE_URL}/auth/login`, data);
}
export const getRooms = async () => {
    return await axios.get(`${BASE_URL}/rooms/`);
}
export const createRoom = async (data) => {
    return await axios.post(`${BASE_URL}/rooms/`, data);
}
export const deleteRoom = async (id) => {
    return await axios.delete(`${BASE_URL}/rooms/${id}`);
}
export const getDevices = async () => {
    return await axios.get(`${BASE_URL}/devices/`);
}
export const getDevicesByRoom = async (roomId) => {
    return await axios.get(`${BASE_URL}/devices/room/${roomId}`);
}
export const createDevice = async (data) => {
    return await axios.post(`${BASE_URL}/devices/`, data);
}
export const controlDevice = async (id, data) => {
    return await axios.patch(`${BASE_URL}/devices/${id}/control`, data);
}
export const deleteDevice = async (id) => {
    return await axios.delete(`${BASE_URL}/devices/${id}`);
}
export const getLogs = async () => {
    return await axios.get(`${BASE_URL}/logs/`);
}
export const createSchedule = async (data) => {
    return await axios.post(`${BASE_URL}/schedules/`, data);
}
export const getSchedules = async () => {
    return await axios.get(`${BASE_URL}/schedules/`);
}
export const createGuest = async (data) => {
    return await axios.post(`${BASE_URL}/guests/`, data);
}
