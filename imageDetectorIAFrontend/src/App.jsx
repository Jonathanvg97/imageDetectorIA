import "./index.css";
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router } from "react-router-dom";
import { RoutesConfig } from "./routes";
import { GoogleLogin } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';


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
      <ToastContainer />
      <RoutesConfig />
    </Router>
  );
}

export default App;
