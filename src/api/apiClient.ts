import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosInstance, InternalAxiosRequestConfig} from 'axios';

const apiUrl = process.env.BACKEND_URL ?? 'http://192.168.1.21:8080';

// Tạo Axios instance không có xác thực
export const axiosWithoutAuth: AxiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 10000, // Đặt thời gian chờ 10 giây
});

// Tạo Axios instance có xác thực
export const axiosWithAuth: AxiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
});

// Thêm interceptor cho axiosWithAuth để thêm token vào request header
axiosWithAuth.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const userToken = await AsyncStorage.getItem('userToken');
    console.log('==token 1==', userToken);

    const tenant = await AsyncStorage.getItem('tenantStore');
    console.log('==tenant 1==', tenant);
    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
      config.headers['X-Tenant'] = tenant;
    }
    return config;
  },
  error => {
    console.log('==error==', JSON.stringify(error));

    return Promise.reject(error);
  },
);
