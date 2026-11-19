import api from './api';

export const reminderService = {
  createReminder: async (reminderData) => {
    const response = await api.post('/reminders', reminderData);
    return response.data;
  },

  getReminders: async () => {
    const response = await api.get('/reminders');
    return response.data;
  },

  updateReminder: async (id, updateData) => {
    const response = await api.put(`/reminders/${id}`, updateData);
    return response.data;
  },

  deleteReminder: async (id) => {
    const response = await api.delete(`/reminders/${id}`);
    return response.data;
  }
};
