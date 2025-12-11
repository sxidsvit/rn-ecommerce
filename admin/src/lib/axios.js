import axios from "axios";
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// export default apiClient;

export const useApi = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const interceptor = apiClient.interceptors.request.use(async (config) => {
      const token = await getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    // cleanup: remove interceptor when component unmounts

    return () => {
      apiClient.interceptors.request.eject(interceptor);
    };
  }, [getToken]);

  return apiClient;
};
