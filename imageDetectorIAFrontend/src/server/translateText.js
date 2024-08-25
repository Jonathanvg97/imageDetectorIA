// Accede a la variable de entorno
const API_URL = import.meta.env.VITE_API_URL;

export const translateText = async (text) => {
    try {
        const response = await fetch(`${API_URL}/api/translate-text`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in translateText:', error);
        throw error;
    }
}