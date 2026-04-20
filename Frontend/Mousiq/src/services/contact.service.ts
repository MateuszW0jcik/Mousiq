import {apiClient} from './api.service';
import type {Contact, ContactRequest} from '../types/contact.types';
import type {MessageResponse} from '../types/api.types';

export const contactService = {
    getUserContacts: async (): Promise<Contact[]> => {
        const response = await apiClient.get<Contact[]>('/api/contacts');
        return response.data;
    },

    addContact: async (request: ContactRequest): Promise<MessageResponse> => {
        const response = await apiClient.post<MessageResponse>('/api/contacts', request);
        return response.data;
    },

    editContact: async (id: string, request: ContactRequest): Promise<MessageResponse> => {
        const response = await apiClient.put<MessageResponse>(`/api/contacts/${id}`, request);
        return response.data;
    },

    deleteContact: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/contacts/${id}`);
    },
};

export default contactService;