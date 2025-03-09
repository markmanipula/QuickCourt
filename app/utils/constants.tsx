export const API_BASE_URL = "http://10.0.0.9:5001"; // Primary Base URL

export const ENDPOINTS = {
    EVENTS: `${API_BASE_URL}/events`,
    EVENT_BY_ID: (eventId: string | string[]) =>
        `${API_BASE_URL}/events/${Array.isArray(eventId) ? eventId[0] : eventId}`,
    TOGGLE_PAID: (eventId: string | string[], participantName: string) =>
        `${API_BASE_URL}/events/${Array.isArray(eventId) ? eventId[0] : eventId}/participants/${participantName}/toggle-paid`,
    LEAVE_EVENT: (eventId: string | string[]) =>
        `${API_BASE_URL}/events/${Array.isArray(eventId) ? eventId[0] : eventId}/leave`,
    JOIN_EVENT: (eventId: string | string[]) =>
        `${API_BASE_URL}/events/${Array.isArray(eventId) ? eventId[0] : eventId}/join`,
};