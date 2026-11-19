import api from './api';

export const articleService = {
  getArticles: async (params = {}) => {
    const response = await api.get('/articles', { params });
    return response.data;
  },

  getArticle: async (identifier) => {
    const response = await api.get(`/articles/${identifier}`);
    return response.data;
  },

  createArticle: async (articleData) => {
    const response = await api.post('/articles', articleData);
    return response.data;
  },

  updateArticle: async (id, articleData) => {
    const response = await api.put(`/articles/${id}`, articleData);
    return response.data;
  },

  deleteArticle: async (id) => {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
  }
};
