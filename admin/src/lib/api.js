import axiosInstance from "./axios";
import { useApi } from "./axios";

export const productApi = {
  getAll: async () => {
    // const axiosInstance = useApi();
    console.log('productApi - axiosInstance: ', axiosInstance);
    const { data } = await axiosInstance.get("/admin/products");
    return data;
  },

  create: async (formData) => {
    const axiosInstance = useApi();
    const { data } = await axiosInstance.post("/admin/products", formData);
    return data;
  },

  update: async ({ id, formData }) => {
    const axiosInstance = useApi();
    const { data } = await axiosInstance.put(`/admin/products/${id}`, formData);
    return data;
  },

  delete: async (productId) => {
    const axiosInstance = useApi();
    const { data } = await axiosInstance.delete(`/admin/products/${productId}`);
    return data;
  },
};

export const orderApi = {
  getAll: async () => {
    const axiosInstance = useApi();
    const { data } = await axiosInstance.get("/admin/orders");
    return data;
  },

  updateStatus: async ({ orderId, status }) => {
    const axiosInstance = useApi();
    const { data } = await axiosInstance.patch(`/admin/orders/${orderId}/status`, { status });
    return data;
  },
};

export const statsApi = {
  getDashboard: async () => {
    const { data } = await axiosInstance.get("/admin/stats");
    return data;
  },
};

export const customerApi = {
  getAll: async () => {
    const axiosInstance = useApi();
    const { data } = await axiosInstance.get("/admin/customers");
    return data;
  },
};
