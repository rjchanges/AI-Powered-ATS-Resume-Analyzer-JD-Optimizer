import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Vite proxy forwards to backend
    timeout: 120_000,
});

export const analyzeGeneral = async (formData) => {
    try {
        const response = await api.post('/general', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error(error.message || 'An unexpected error occurred during general analysis.');
    }
};

export const analyzeTailored = async (formData) => {
    try {
        const response = await api.post('/tailored', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error(error.message || 'An unexpected error occurred during tailored analysis.');
    }
};
