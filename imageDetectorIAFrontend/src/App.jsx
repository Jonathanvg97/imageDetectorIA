// import { ImageToConvertForm } from './components/imageToConvertForm/imageToConvertForm';
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import { RoutesConfig } from "./routes";
import { GoogleLogin } from '@react-oauth/google';


function App() {
  return (
    <Router>
      <GoogleLogin
        onSuccess={credentialResponse => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
      <RoutesConfig />
    </Router>
  );
}

export default App;
