
const API_URL = import.meta.env.VITE_API_URL;

export const fetchHabits = async (token: string) => {
    const response = await fetch(`${API_URL}/habits`, {
        headers: {Authorization: 'Bearer ' +token}
    });
    if (!response.ok) {  
        throw new Error('Failed to fetch habits');
    }   
    return response.json(); 
};

export const markAsDone = async (habitId: string, token: string) => {
    const response = await fetch(`${API_URL}/habits/markasdone/${habitId}`, {
        method: 'PATCH',
        headers: {Authorization: 'Bearer ' +token}
    })
    return response.json();
};

export const fetchAddHabit = async (token:string, title:string, description:string) => {
    const response = await fetch(`${API_URL}/habits`, {
        method: 'POST',
        headers: {Authorization: 'Bearer ' +token, 'Content-Type': 'application/json'
        },
        body: JSON.stringify({title: title, description: description})
    });
    if (!response.ok) {  
        throw new Error('Failed to add habit');
    }   
    return response.json(); 
};

