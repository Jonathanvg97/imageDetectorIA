import { useState, useEffect } from "react";
import { convertImageToText } from "../../server/convertImageToText";
import { PreviewImage } from "../previewImage/previewImage";
import { useImageStore } from "../../stores/useImageStore";

export const ImageToConvertForm = () => {
    //lOCAL STATE
    const [loading, setLoading] = useState(false);
    //STORE WITH ZUSTAND
    const {
        imageURL,
        setImageURL,
        imageDescription,
        setImageDescription,
        setOriginalText,
        reset,
    } = useImageStore(); // Desestructura el estado y el setter de la store

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            if (!imageDescription) {
                const data = await convertImageToText(imageURL);
                setImageDescription(data.generated_text);
                setOriginalText(true);
            }
        } catch (err) {
            console.error(err);
            setImageDescription("Error converting image to text.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!imageURL) {
            reset(); // Resetea el estado cuando imageURL está vacío
        }
    }, [imageURL, reset]);

    return (
        <div className="ImageToConvertForm min-h-screen flex justify-center items-center p-4">
            <div className="w-[50%] flex justify-center items-center">
                <PreviewImage />
            </div>
            <div className="p-4 rounded-lg w-[50%] flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-4 text-center text-cyan-50">
                    Convert Image to Text
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6 pt-4 w-full items-center"
                >
                    <div className="flex flex-col items-center w-full">
                        <label
                            htmlFor="imageURL"
                            className="text-lg font-medium mb-2 text-cyan-50"
                        >
                            Image URL:
                        </label>
                        <input
                            type="text"
                            id="imageURL"
                            value={imageURL}
                            onChange={(e) => setImageURL(e.target.value)}
                            className="border border-gray-300 rounded p-2"
                            required
                            style={{ borderRadius: "10px", width: "400px" }}
                        />
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={loading || imageDescription}
                            className="bg-gray-200 text-black font-extrabold shadow-md border-1 shadow-zinc-50 py-2 px-4 rounded hover:bg-gray-300 disabled:opacity-50"
                        >
                            {loading ? "Processing..." : "Describe Image"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
