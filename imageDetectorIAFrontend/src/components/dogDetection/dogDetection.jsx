import { useState } from "react";
import { dogDetectionImage } from "../../server/dogDetectionImage";
import { useImageStore } from "../../stores/useImageStore";
import { PreviewImage } from "../previewImage/previewImage"
import { DogAnimation } from "../utils/dogAnimation";
import { useNavigate } from "react-router-dom";
import { Loader } from "../utils/loader/loader";
import { getErrorMessageImageToText } from "../utils/errors/imageErrorToTextUtils";
import { toast } from "react-toastify";
export const DogDetection = () => {
    // LOCAL STATE
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(false)
    //STORE WITH ZUSTAND
    const {
        imageURL,
        isDog,
        setIsDog,
        isDetecting,
        setIsDetecting,
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
            setIsDetecting(true);
            toast.success("Detection has been successful!");
        } catch (error) {
            const { status } = error;
            toast.error(getErrorMessageImageToText(status));
            setIsDog(false); // También establece isDog en false si ocurre un error
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="ImageToConvertForm min-h-screen flex justify-center items-center p-4 relative overflow-hidden">
            <div className="absolute top-4 left-4">
                <button className="bg-gray-200 text-black font-extrabold shadow-md border-1 shadow-zinc-50 py-2 px-4 rounded hover:bg-gray-300 disabled:opacity-50"
                    onClick={() => navigate(-1)}>
                    Volver
                </button>
            </div>
            <div className="w-[50%] flex justify-center items-center">
                <PreviewImage isDogDetection={true} />
            </div>
            <div className="p-4 rounded-lg w-[50%] flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-4 text-center text-cyan-50">
                    {!result ? "Do you want to detect if there is a dog in the image ?" : isDog ? "Yes, there is a dog" : "No, there is no dog"}
                </h1>
                {isDetecting && <p className="text-white font-bold my-5">this image has already been detected
                </p>}
                <button className={`${!loading && "bg-slate-200 rounded-full flex mt-10"}`} disabled={loading || result || isDetecting} onClick={handleDogDetection}>
                    {!loading ? <DogAnimation /> : <Loader />}
                </button>
            </div>
        </div>

    )
}
