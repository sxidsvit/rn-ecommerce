import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";
import { useEffect } from "react";

const API_URL = "https://rn-ecommerce-backend.vercel.app/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- 1. GLOBAL LOGGER (Outside the hook) ---
// This block will fire ONCE. The logs will be clean, without duplicates.

if (__DEV__) {
  api.interceptors.response.use(
    (response) => {
      console.groupCollapsed(
        `✅ [${response.status}] ${response.config.method?.toUpperCase()} ${response.config.url}`
      );
      console.log("Headers:", response.config.headers);
      if (response.config.data) {
        try {
          console.log("Payload:", JSON.parse(response.config.data));
        } catch {
          console.log("Payload:", response.config.data);
        }
      }
      console.log("Response:", response.data);
      console.groupEnd();
      return response;
    },
    (error) => {
      console.group(`❌ NETWORK ERROR: ${error.config?.url}`);
      console.warn("Status:", error.response?.status || "No Response");
      console.warn("Data:", error.response?.data);
      console.groupEnd();
      return Promise.reject(error);
    }
  );
}

export const useApi = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    // --- 2. AUTHORIZATION INTERCEPTOR ---
    // Needed inside a hook because it uses getToken() from Clerk
    const authInterceptor = api.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [getToken]);

  return api;
};