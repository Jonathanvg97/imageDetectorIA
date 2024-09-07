import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const verifyGoogleToken = async (googleToken) => {
  try {
    const response = await axios.post(`${API_URL}/auth/google-login`, {
      token: googleToken,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
