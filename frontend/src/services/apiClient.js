async function request(endpoint, options = {}) {

    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(endpoint, config);

        if (response.status === 401) {
            console.warn("Unauthorized: Token might be expired or invalid.");
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'API request failed');
        }
        return data;
    } catch (error) {
        console.error(`API Error on ${endpoint}:`, error.message);
        throw error;
    }
}

export const api = {
    get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint, body, options) => request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
};