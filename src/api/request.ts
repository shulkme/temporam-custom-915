import { delToken, getToken } from '@/utils/token';
import axios, { type AxiosResponse } from 'axios';
import qs from 'qs';

/**
 * request
 */
const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL!,
  timeout: +process.env.NEXT_PUBLIC_API_TIMEOUT!,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
  },
  // withCredentials: true,
  paramsSerializer: (params) => {
    return qs.stringify(params, {
      arrayFormat: 'repeat',
    });
  },
});

/**
 * request interceptor
 */
request.interceptors.request.use(
  (config) => {
    const token = getToken();
    // 携带token
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * response interceptor
 */
request.interceptors.response.use(
  <T>(response: AxiosResponse<T>): T => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { url } = error.config;
      if (error.response.status === 401 && !['/emails/pull'].includes(url)) {
        delToken();
        window.location.replace('/login');
      }
      // Server error
      const { code, msg } = error.response.data;
      return Promise.reject({
        status: code,
        message: msg,
      });
    } else {
      // Error before request
      return Promise.reject(error);
    }
  },
);

export default request;
