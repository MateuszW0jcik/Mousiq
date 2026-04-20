export interface Message {
    id: string;
    content: string;
    sentAt: string;
    name: string;
    email: string;
}

export interface MessageRequest {
    content: string;
    name?: string;
    email?: string;
}

export interface MessageListParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
}