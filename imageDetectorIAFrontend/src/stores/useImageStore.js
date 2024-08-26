import { create } from "zustand";
import zukeeper from "zukeeper";

export const useImageStore = create(zukeeper(set => ({
    imageURL: '',
    setImageURL: (imageURL) => set({ imageURL: imageURL }),
    imageDescription: '',
    setImageDescription: (description) => set({ imageDescription: description }),
    textTranslated: null,
    setTextTranslated: (textTranslated) => set({ textTranslated }),
    originalText: false,
    setOriginalText: (originalText) => set({ originalText }),
    isDog: false,
    setIsDog: (isDog) => set({ isDog: isDog }),
    reset: () => set({
        imageURL: '',
        imageDescription: '',
        textTranslated: null,
        originalText: false,
        isDog: false
    }),
})));



