import { useImageStore } from "../stores/useImageStore";
import { toast } from 'react-toastify';
import { getErrorMessageImageToText } from "../components/utils/errors/imageErrorToTextUtils";
import { convertImageToText } from "../server/convertImageToText";
import { dogDetectionImage } from "../server/dogDetectionImage";
import { translateText } from "../server/translateText";
import { getErrorMessageTranslate } from "../components/utils/errors/translateError";

export const useImageIA = () => {
    // Accedemos a las funciones y estados desde el store de Zustand
    const {
        imageURL,
        setImageURL,
        imageDescription,
        setImageDescription,
        setOriginalText,
        setLoading,
        setIsDog,
        setResult,
        setIsDetecting,
        textTranslated,
        setTextTranslated,
    } = useImageStore();

    // Manejador para el cambio de la URL de la imagen
    const handleURLChange = (e) => {
        setImageURL(e.target.value);
    };

    // Función para manejar el submit y la conversión de imagen a texto
    const handleSubmitConvertImageToText = async (e) => {
        e.preventDefault();

        try {
            setLoading(true); // Activa el estado de carga
            if (!imageDescription) { // Solo ejecuta si no hay descripción previa
                const data = await convertImageToText(imageURL);
                setImageDescription(data);
                setOriginalText(true);
                toast.success("Image converted to text successfully!");
            }
        } catch (error) {
            const { status } = error;
            toast.error(getErrorMessageImageToText(status));
        } finally {
            setLoading(false); // Finaliza el estado de carga
        }
    };

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

    const handleTranslateToSpanish = async () => {
        try {
            setLoading(true);
            if (!textTranslated) {
                const response = await translateText(imageDescription);
                setTextTranslated(response); // Guarda la descripción traducida en la store
                toast.success("Text translated successfully.");
            }
            setOriginalText(false);

        } catch (error) {
            const { status } = error;
            toast.error(getErrorMessageTranslate(status));
        } finally {
            setLoading(false);
        }
    };

    //función para resetear el texto traducido
    const handleTranslateReset = () => {
        setOriginalText(true);
    };


    return {
        handleURLChange,
        handleSubmitConvertImageToText,
        handleDogDetection,
        handleTranslateToSpanish,
        handleTranslateReset
    };
};
