# Image Detector IA

Este proyecto es una aplicación web que permite a los usuarios detectar la presencia de perros en una imagen proporcionada a través de una URL, permite describer una imagen y traducir su texto. Utiliza un modelo de inteligencia artificial para analizar las imágenes y devolver un resultado.

## Tabla de Contenidos

- [Tecnologías y Herramientas Utilizadas](#tecnologías-y-herramientas-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Instalación y Configuración](#instalación-y-configuración)
- [Contribuciones y Licensia](#contribuciones-y-licensia)

## Tecnologías y Herramientas Utilizadas

### Backend

- **Node.js**: Entorno de ejecución para el código JavaScript.
- **Node.js**: v21.6.2.
- **Express.js**: Framework para construir aplicaciones web y APIs.
- **huggingface**: Biblioteca de machine learning para realizar la detección de perros y demás.
- **Vercel**: Plataforma para desplegar el backend y frontend.

### Frontend

- **React.js**: Biblioteca de JavaScript para construir interfaces de usuario.
- **Tailwind CSS**: Framework CSS para diseñar la UI.
- **Zustand**: Biblioteca para la gestión del estado global en React.
- **Vite**: Herramienta de desarrollo rápida y ligera.
- **React Router**: Herramienta para manejar la navegación en la aplicación.

## Estructura del Proyecto

### Backend

El backend está diseñado para manejar la detección de perros en las imágenes proporcionadas y demás funciones. La estructura del proyecto backend es la siguiente:

```plaintext
Backend/
├── controllers/
│   └── dogDetectionController.js # Controlador para la detección de perros
├── routes/
│   └── dogDetectionRoutes.js  # Rutas del backend
├── servers/
│   └── dogDetectionServer.js  # Server del backend
├── utils/
│   └── dog.js para crear un json con las razas de perros
├── index.js                   # Punto de entrada de la aplicación
└── package.json               # Dependencias y scripts del backend
```

### Frontend

```plaintext
Frontend/
├── src/
│   ├── assets/                # Recursos estáticos como imágenes y fuentes
│   ├── components/
│   │   ├── dogDetection/      # Componentes relacionados con la detección
│   │   │   ├── dogDetection.jsx
│   │   │   └── dogDetection.css
│   │   ├── previewImage/      # Componentes para previsualizar imágenes
│   │   └── utils/             # Utilidades y funciones de ayuda
│   │       └── loader.jsx
│   ├── stores/
│   │   └── useImageStore.js   # Almacén de estado global usando Zustand
│   ├── App.jsx                # Componente principal de la aplicación
│   └── main.jsx               # Punto de entrada del frontend
└── package.json               # Dependencias y scripts del frontend
```

## Instalación y Configuración

### Clonar el Repositorio

Primero, clona el repositorio desde GitHub:

git clone https://github.com/Jonathanvg97/imageDetectorIA.git

### Instalacón del Backend

- Ir a la carpeta del back cd tu-repositorio/backend
- npm i
- Agregar las variables de entorno como esta en el .env.template

### Instalacón del Frontend

- Ir a la carpeta del back cd tu-repositorio/Frontend
- npm i
- Agregar las variables de entorno como esta en el .env.local.template

## Contribuciones y Licensia

- Realizado por Jonathan Vanegas
