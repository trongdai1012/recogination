import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosInstance, InternalAxiosRequestConfig} from 'axios';

const apiUrl = process.env.BACKEND_URL ?? 'http://192.168.1.21:8080';

export const axiosWithoutAuth: AxiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
});

export const axiosWithAuth: AxiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
});

axiosWithAuth.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const tenant = await AsyncStorage.getItem('tenantStore');
      if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
        if (tenant) {
          config.headers['X-Tenant'] = tenant;
        }
      }
    } catch (error) {
      console.log('Error accessing AsyncStorage:', error);
    }

    return config;
  },
  error => {
    console.log('==error==', JSON.stringify(error));
    return Promise.reject(error);
  },
);
