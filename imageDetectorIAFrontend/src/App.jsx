import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router } from "react-router-dom";
import { RoutesConfig } from "./routes";
import { ToastContainer } from "react-toastify";
import { AuthLogin } from "./components/login/authLogin";
import { UserProfile } from "./components/userProfile/userProfile";
import { FloatLogin } from "./components/floatLogin/floatLogin";
import { useImageStore } from "./stores/useImageStore";
import { Footer } from "./components/footer/footer";

function App() {
  //zustand
  const { loadingOAuth } = useImageStore();
  return (
    <Router>
      <div className="absolute">
        <FloatLogin />
        <UserProfile />
      </div>
      <ToastContainer />
      {!loadingOAuth && (
        <AuthLogin>
          <RoutesConfig />
          <Footer />
        </AuthLogin>
      )}
    </Router>
  );
}

export default App;
