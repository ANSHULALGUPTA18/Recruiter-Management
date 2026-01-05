import axios from 'axios';
import { User, Task, JobSummary, QuickLink, ApiResponse } from '../constants/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Try to get token from MSAL
    try {
      const accounts = sessionStorage.getItem('msal.account.keys');
      if (accounts) {
        // Token will be added by MSAL if available
        // For now, just proceed without blocking requests
      }
    } catch (error) {
      console.warn('Could not retrieve auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const userApi = {
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/user/profile');
    return response.data.data!;
  },
};

export const taskApi = {
  getAll: async (): Promise<Task[]> => {
    const response = await apiClient.get<ApiResponse<Task[]>>('/tasks');
    return response.data.data!;
  },

  create: async (title: string): Promise<Task> => {
    const response = await apiClient.post<ApiResponse<Task>>('/tasks', { title });
    return response.data.data!;
  },

  update: async (id: string, updates: Partial<Task>): Promise<Task> => {
    const response = await apiClient.patch<ApiResponse<Task>>(`/tasks/${id}`, updates);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};

export const jobApi = {
  getSummary: async (): Promise<JobSummary> => {
    const response = await apiClient.get<ApiResponse<JobSummary>>('/jobs/summary');
    return response.data.data!;
  },
};

export const quickLinkApi = {
  getAll: async (): Promise<QuickLink[]> => {
    const response = await apiClient.get<ApiResponse<QuickLink[]>>('/quick-links');
    return response.data.data!;
  },

  create: async (name: string, url: string): Promise<QuickLink> => {
    const response = await apiClient.post<ApiResponse<QuickLink>>('/quick-links', { name, url });
    return response.data.data!;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/quick-links/${id}`);
  },
};
