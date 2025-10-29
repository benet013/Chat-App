import axios from 'axios';
import { ACCESS_TOKEN } from './constant';

const isDevelopment = import.meta.env.MODE === 'development';

const api = axios.create({
    baseURL : isDevelopment? import.meta.env.VITE_API_URL_DEVELOPMENT : import.meta.env.VITE_API_URL_DEPLOYMENT,
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api;