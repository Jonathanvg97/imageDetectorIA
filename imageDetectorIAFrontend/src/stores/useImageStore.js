import { create } from "zustand";
import zukeeper from "zukeeper";

export const useImageStore = create(
  zukeeper((set) => ({
    imageURL: "",
    setImageURL: (imageURL) => set({ imageURL: imageURL }),
    user: JSON.parse(sessionStorage.getItem("user")) || null,
    setUser: (user) => {
      sessionStorage.setItem("user", JSON.stringify(user));
      set({ user });
    },
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
    setLoadingAuth: (loading) => set({ loadingAuth: loading }),
    loadingOAuth: false,
    setLoadingOAuth: (loadingOAuth) => set({ loadingOAuth: loadingOAuth }),
    isDetecting: false,
    setIsDetecting: (isDetecting) => set({ isDetecting: isDetecting }),
    modalUserCreate: false,
    setModalUserCreate: (modalUserCreate) => set({ modalUserCreate }),
    editionMode: false,
    setEditionMode: (editionMode) => set({ editionMode }),
    modalUserLogin: false,
    setModalUserLogin: (modalUserLogin) => set({ modalUserLogin }),
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
        modalUserCreate: false,
        modalUserLogin: false,
        editionMode: false,
      }),
  }))
);
