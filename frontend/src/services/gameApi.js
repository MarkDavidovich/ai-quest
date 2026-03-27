const API_URL = '/api/game';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const saveGameToBackend = async (gameState) => {
    const response = await fetch(`${API_URL}/save`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(gameState)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save game');
    }

    return response.json();
};

export const loadGameFromBackend = async () => {
    const response = await fetch(`${API_URL}/load`, {
        method: 'GET',
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to load game');
    }

    return response.json();
};