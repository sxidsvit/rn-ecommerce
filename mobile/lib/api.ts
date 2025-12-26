import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";
import { useEffect } from "react";

// localhost will work in simulator
// const API_URL = "http://localhost:3000/api";
// prod url will work in your physical device
const API_URL = "https://rn-ecommerce-backend.vercel.app/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const useApi = () => {
  console.warn("useApi hook initialized!"); j
  const { getToken } = useAuth();

  useEffect(() => {
    const interceptor = api.interceptors.request.use(async (config) => {
      const token = await getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    // Log responses and errors in development mode 
    const logInterceptor = api.interceptors.response.use(
      (response) => {
        if (__DEV__) {
          console.groupCollapsed(`✅ [${response.status}] ${response.config.method?.toUpperCase()} ${response.config.url}`);

          console.warn('--- Outgoing Headers ---');
          console.warn(response.config.headers);

          console.warn('--- Outgoing Data (Payload) ---');
          if (response.config.data) {
            try {
              console.warn(JSON.parse(response.config.data));
            } catch (e) {
              console.warn(response.config.data);
            }
          } else {
            console.warn('No data sent');
          }

          console.warn('--- Server Response Body ---');
          console.warn(response.data);

          console.groupEnd();
        }
        return response;
      },
      (error) => {
        if (__DEV__) {
          console.group('❌ NETWORK ERROR');
          console.warn('URL:', error.config?.url);
          console.warn('Status:', error.response?.status || 'No Response');
          console.warn('Data:', error.response?.data);
          console.groupEnd();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(interceptor);
      api.interceptors.response.eject(logInterceptor);
    };
  }, [getToken]);

  return api;
};

// on every single req, we would like have an auth token so that our backend knows that we're authenticated
// we're including the auth token under the auth headers
