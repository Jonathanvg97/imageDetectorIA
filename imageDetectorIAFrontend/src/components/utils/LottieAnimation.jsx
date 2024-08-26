// src/components/utils/LottieAnimation.jsx
import Lottie from 'lottie-react';

export const LottieAnimation = () => {
  const lottieUrl = "https://lottie.host/4e872978-e9ba-49f1-a94e-7d338d1a73a2/BkDzoZ3P5Y.json";

  return (
    <Lottie
      path={lottieUrl}  // Usar la URL en lugar de importar un archivo local
      loop
      autoplay
      style={{ width: '150px' }}
    />

  );
};
