// dashboard/_lib/axiosInstance.ts
import axios from 'axios';
import { getSession } from 'next-auth/react';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
axiosInstance.interceptors.request.use(async (config) => {
  const session = await getSession();
  console.log("in interceptor",session)
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

export default axiosInstance;
