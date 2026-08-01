import API from './api';

export const productService = {
  getProducts: async () => {
    // Expected endpoint: GET /api/products
    const response = await API.get('/api/products');
    return response.data;
  },

  getProductById: async (id) => {
    // Expected endpoint: GET /api/products/{id}
    const response = await API.get(`/api/products/${id}`);
    return response.data;
  }
};
