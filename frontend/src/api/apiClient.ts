const API_URL = import.meta.env.VITE_API_URL || '';

export const apiClient = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      credentials: 'include',
    });
    return response;
  },
  post: async (endpoint: string, body: any) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });
    return response;
  },
  // Add other methods if needed (PUT, DELETE, etc.)
};
