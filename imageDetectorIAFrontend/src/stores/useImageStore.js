import { create } from "zustand";
import zukeeper from "zukeeper";

export const useImageStore = create(
  zukeeper((set) => ({
    imageURL: "",
    setImageURL: (imageURL) => set({ imageURL: imageURL }),
    imageDescription: "",
    setImageDescription: (description) =>
      set({ imageDescription: description }),
    textTranslated: null,
    setTextTranslated: (textTranslated) => set({ textTranslated }),
    originalText: false,
    setOriginalText: (originalText) => set({ originalText }),
    isDog: false,
    setIsDog: (isDog) => set({ isDog: isDog }),
    result: false,
    setResult: (result) => set({ result: result }),
    loading: false,
    setLoading: (loading) => set({ loading: loading }),
    loadingAuth: false,
    setLoadingAuth: (loadingAuth) => set({ loadingAuth: loadingAuth }),
    loadingOAuth: false,
    setLoadingOAuth: (loadingOAuth) => set({ loadingOAuth: loadingOAuth }),
    isDetecting: false,
    setIsDetecting: (isDetecting) => set({ isDetecting: isDetecting }),
    closeModalGoogle: true,
    setCloseModalGoogle: (closeModalGoogle) =>
      set({ closeModalGoogle: closeModalGoogle }),
    reset: () =>
      set({
        imageURL: "",
        imageDescription: "",
        textTranslated: null,
        originalText: false,
        isDog: false,
        result: false,
        loading: false,
        loadingAuth: false,
        loadingOAuth: false,
        isDetecting: false,
        closeModalGoogle: true,
      }),
  }))
);
