const API_URL = import.meta.env.VITE_API_URL;

export const fetchRegisterUser = async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
    },
        body: JSON.stringify({
            "username": username,
            "password": password,
        })
    });
    if (!response.ok) {
        throw new Error('Failed to register user');
    }
    return response;
};

export const fetchLoginUser = async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
    },
        credentials: 'include',
        body: JSON.stringify({
            "username": username,
            "password": password,
        })
    });
    if (!response.ok) {
        throw new Error('Failed to login user');
    }
    return response;
};