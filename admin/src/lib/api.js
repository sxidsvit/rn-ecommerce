/**
 * Example of use in a component:
 * const apiClient = useApi(); 
 * We use the passed apiClient, which already contains the Authorization header
 * const products = await productApi.getAll(apiClient); 
 */

export const productApi = {
  getAll: async (apiClient) => {
    const { data } = await apiClient.get("/admin/products");
    return data;
  },

  create: async (apiClient, formData) => {
    const { data } = await apiClient.post("/admin/products", formData);
    return data;
  },

  update: async (apiClient, { id, formData }) => {
    const { data } = await apiClient.put(`/admin/products/${id}`, formData);
    return data;
  },

  delete: async (apiClient, productId) => {
    const { data } = await apiClient.delete(`/admin/products/${productId}`);
    return data;
  },
};

export const orderApi = {
  getAll: async (apiClient) => {
    const { data } = await apiClient.get("/admin/orders");
    return data;
  },

  updateStatus: async (apiClient, { orderId, status }) => {
    const { data } = await apiClient.patch(`/admin/orders/${orderId}/status`, { status });
    return data;
  },
};

export const statsApi = {
  getDashboard: async (apiClient) => {
    const { data } = await apiClient.get("/admin/stats");
    return data;
  },
};

export const customerApi = {
  getAll: async (apiClient) => {
    const { data } = await apiClient.get("/admin/customers");
    return data;
  },
};
