import API from './api';

export const categoryService = {
  getCategories: async () => {
    // Expected endpoint: GET /api/categories
    const response = await API.get('/api/categories');
    return response.data;
  }
};
