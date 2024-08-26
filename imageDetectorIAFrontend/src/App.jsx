// import { ImageToConvertForm } from './components/imageToConvertForm/imageToConvertForm';
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import { RoutesConfig } from "./routes";

function App() {
  return (
    <Router>
      <RoutesConfig />
    </Router>
  );
}

export default App;
