import { getErrorMessageImageToText } from "../components/utils/errors/imageErrorToTextUtils";

const API_URL = import.meta.env.VITE_API_URL;

export const convertImageToText = async (imageURL) => {
    try {
        const response = await fetch(`${API_URL}/api/convert-image-to-text`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageURL }),
        });

        if (!response.ok) {
            throw { status: response.status, message: getErrorMessageImageToText(response.status) };
        }


        return await response.json();
    } catch (error) {
        console.error('Error in convertImageToText:', error.message);
        throw error;
    }
};
