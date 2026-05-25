// Chat API: sends assistant prompts to the backend.
// It posts user messages to the chatbot endpoint.
// Use this file when the assistant needs a backend reply.
import { api } from './api';

export const sendChatMessage = (payload) => api.post('/chat', payload);
