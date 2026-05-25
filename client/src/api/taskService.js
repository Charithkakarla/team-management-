// Task API: CRUD and status actions for tasks.
// It covers task creation, editing, completion, and deletion.
// Use this file for all task-related network calls.
import { api } from './api';

export const fetchTasks = () => api.get('/tasks');
export const createTask = (payload) => api.post('/tasks', payload);
export const updateTask = (id, payload) => api.patch(`/tasks/${id}`, payload);
export const completeTask = (id) => api.post(`/tasks/${id}/complete`);
export const undoTask = (id) => api.post(`/tasks/${id}/undo`);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
