import axios from 'axios';

import { setupAuthInterceptors } from './interceptors';

export const API_URL = `${window.extended.VITE_API_BASE_URL}/api`;

export const httpClient = axios.create({
  withCredentials: true,
  baseURL: '/api',
});

setupAuthInterceptors(httpClient, API_URL);
