export const LOCAL_API_BASE_URL = "http://10.0.0.9:5001"; // Primary Base URL
export const FIREBASE_API_BASE_URL = "https://api-tiujkskw5a-uc.a.run.app"; // Primary Base URL

export const ENDPOINTS = {
    EVENTS: `${FIREBASE_API_BASE_URL}/events`,
    EVENT_BY_ID: (eventId: string | string[]) =>
        `${FIREBASE_API_BASE_URL}/events/${Array.isArray(eventId) ? eventId[0] : eventId}`,
    TOGGLE_PAID: (eventId: string | string[], participantName: string) =>
        `${FIREBASE_API_BASE_URL}/events/${Array.isArray(eventId) ? eventId[0] : eventId}/participants/${participantName}/toggle-paid`,
    LEAVE_EVENT: (eventId: string | string[]) =>
        `${FIREBASE_API_BASE_URL}/events/${Array.isArray(eventId) ? eventId[0] : eventId}/leave`,
    JOIN_EVENT: (eventId: string | string[]) =>
        `${FIREBASE_API_BASE_URL}/events/${Array.isArray(eventId) ? eventId[0] : eventId}/join`,
};