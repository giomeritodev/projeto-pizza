import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { API_CONFIG } from "../config/api.config";

const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        "Content-Type": "application/json"
    }
})


//Interceptor para adicionar o token e todas as requisições
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("@token:visaosistemas");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//Caso tenha erro do tipo 401 remove o token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await AsyncStorage.removeItem("@token:visaosistemas");
        }
        return Promise.reject(error);
    }
)

export default api;