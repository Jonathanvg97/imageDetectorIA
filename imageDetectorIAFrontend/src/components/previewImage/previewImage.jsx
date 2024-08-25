import { useState } from "react";
import { translateText } from "../../server/translateText";
import { useImageStore } from "../../stores/useImageStore"; // Importa la store

export const PreviewImage = () => {
    const {
        imageDescription,
        imageURL,
        textTranslated,
        setTextTranslated,
        originalText,
        setOriginalText,
    } = useImageStore();

    const [loading, setLoading] = useState(false);

    const handleTranslateToSpanish = async () => {
        try {
            setLoading(true);
            if (!textTranslated) {
                const response = await translateText(imageDescription);
                setTextTranslated(response.translation_text); // Guarda la descripción traducida en la store
            }
            setOriginalText(false);

        } catch (error) {
            console.error(error);
            setTextTranslated("Error translating text.");
        } finally {
            setLoading(false);
        }
    };

    const handleTranslateReset = () => {
        setOriginalText(true);
    };

    return (
        <div className="flex flex-col items-center bg-gray-100 rounded-lg p-4 mt-4">
            {imageURL ? (
                <img
                    src={imageURL}
                    alt="Preview"
                    className="max-w-full h-auto rounded-md shadow-md"
                />
            ) : (
                <p className="text-gray-500">No image to display</p>
            )}
            {imageURL && imageDescription && (
                <div className="mt-4 p-4 bg-white rounded shadow-md w-full text-center mb-3">
                    <h2 className="text-lg font-medium">Image Description:</h2>
                    <p className="text-gray-800">
                        {originalText ? imageDescription : textTranslated}
                    </p>
                </div>
            )}
            {imageURL && (
                <>
                    {imageDescription && originalText ? (
                        <button
                            onClick={handleTranslateToSpanish}
                            disabled={loading}
                            className="bg-gray-800 text-white font-extrabold shadow-md border-1 shadow-slate-800 py-2 px-4 rounded hover:bg-gray-300 hover:text-fuchsia-950 disabled:opacity-50"
                        >
                            {loading ? "Translating..." : "Translate to Spanish"}
                        </button>
                    ) : imageDescription && !originalText ? (
                        <button
                            onClick={handleTranslateReset}
                            className="bg-gray-800 text-white font-extrabold shadow-md border-1 shadow-slate-800 py-2 px-4 rounded hover:bg-gray-300 hover:text-fuchsia-950 disabled:opacity-50"
                        >
                            Translate to English
                        </button>
                    ) : null}
                </>
            )}

        </div>
    );
};
