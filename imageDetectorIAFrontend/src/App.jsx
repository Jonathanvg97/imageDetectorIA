import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router } from "react-router-dom";
import { RoutesConfig } from "./routes";

import { ToastContainer } from "react-toastify";
import { AuthLogin } from "./components/login/authLogin";

function App() {
  return (
    <Router>
      <ToastContainer />
      <AuthLogin>
        <RoutesConfig />
      </AuthLogin>
    </Router>
  );
}

export default App;
