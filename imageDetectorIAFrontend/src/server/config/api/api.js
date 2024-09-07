import axios from "axios";
import { useImageStore } from "../../../stores/useImageStore";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor de respuesta para manejar errores 403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      // Actualizar el estado global para mostrar el modal
      useImageStore.getState().setCloseModalGoogle(false); // Abre el modal si el estado es cerrar
    }
    return Promise.reject(error);
  }
);

export default api;
