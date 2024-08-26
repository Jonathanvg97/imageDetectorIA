const API_URL = import.meta.env.VITE_API_URL;

export const dogDetectionImage = async (imageURL) => {
    try {
        const response = await fetch(`${API_URL}/api/detect-dog`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageUrl: imageURL }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in dogDetectionImage:', error);
        throw error;
    }
}