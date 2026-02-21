import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api', // Uses Vite proxy locally, Vercel env variable in production
    timeout: 120_000,
});

export const analyzeGeneral = async (formData) => {
    try {
        const response = await api.post('/general', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        const message = error?.response?.data?.error || error?.message || 'An unexpected error occurred during general analysis.';
        throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
    }
};

export const analyzeTailored = async (formData) => {
    try {
        const response = await api.post('/tailored', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        const message = error?.response?.data?.error || error?.message || 'An unexpected error occurred during tailored analysis.';
        throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
    }
};
