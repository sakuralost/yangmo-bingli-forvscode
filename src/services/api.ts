import axios from 'axios';
import { Record } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchRecords = async (): Promise<Record[]> => {
    const response = await axios.get(`${API_BASE_URL}/records`);
    return response.data;
};

export const fetchRecordById = async (id: string): Promise<Record> => {
    const response = await axios.get(`${API_BASE_URL}/records/${id}`);
    return response.data;
};

export const createRecord = async (record: Partial<Record>): Promise<Record> => {
    const response = await axios.post(`${API_BASE_URL}/records`, record);
    return response.data;
};

export const updateRecord = async (id: string, record: Partial<Record>): Promise<Record> => {
    const response = await axios.put(`${API_BASE_URL}/records/${id}`, record);
    return response.data;
};

export const uploadImages = async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach(file => {
        formData.append('images', file);
    });

    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data.urls;
};

export const searchRecords = async (query: string): Promise<Record[]> => {
    const response = await axios.get(`${API_BASE_URL}/search`, {
        params: { query }
    });
    return response.data;
};