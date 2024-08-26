import { useState } from "react";
import { dogDetectionImage } from "../../server/dogDetectionImage";
import { useImageStore } from "../../stores/useImageStore";
import { PreviewImage } from "../previewImage/previewImage"
import { LottieAnimation } from "../utils/lottieAnimation"
import { useNavigate } from "react-router-dom";

export const DogDetection = () => {
    // LOCAL STATE
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(false)
    //STORE WITH ZUSTAND
    const {
        imageURL,
        isDog,
        setIsDog,
    } = useImageStore();

    const navigate = useNavigate();

    const handleDogDetection = async () => {
        setLoading(true);
        try {
            const response = await dogDetectionImage(imageURL);
            if (response) {
                setIsDog(response.isDogPresent);
                setResult(true);
            } else {
                setIsDog(false);
                setResult(false);
            }
        } catch (error) {
            console.error("Error in dog detection:", error);
            setIsDog(false); // También establece isDog en false si ocurre un error
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="ImageToConvertForm min-h-screen flex justify-center items-center p-4">
            <div className="w-[50%] flex justify-center items-center">
                <button className="bg-slate-200 rounded-full flex mt-10" onClick={() => navigate(-1)}>Volver</button>
                <PreviewImage isDogDetection={true} />
            </div>
            <div className="p-4 rounded-lg w-[50%] flex flex-col items-center">
                {<h1 className="text-4xl font-bold mb-4 text-center text-cyan-50">
                    {!result ? "Do you want to detect if there is a dog in the image ?" : isDog ? "Yes, there is a dog" : "No, there is no dog"}
                </h1>}

                <button className="bg-slate-200 rounded-full flex mt-10" disabled={loading || result} onClick={handleDogDetection}>
                    {!loading ? <LottieAnimation /> : "Loading..."}
                </button>
            </div>
        </div>
    )
}
