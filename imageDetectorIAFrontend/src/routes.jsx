import { Route, Routes } from 'react-router-dom';
import { ImageToConvertForm } from './components/imageToConvertForm/imageToConvertForm';
import { DogDetection } from './components/dogDetection/dogDetection';

export const RoutesConfig = () => {
    return (
        <Routes>
            <Route path="/" element={<ImageToConvertForm />} />
            <Route path="/detect-dog" element={<DogDetection />} />
        </Routes>
    );

};