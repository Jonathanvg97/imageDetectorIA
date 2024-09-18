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
import { UserCreateForm } from "./components/userCreateForm/userCreateForm";
import { SettingsProfile } from "./components/settingsProfile/settingsProfile";

function App() {
  //zustand
  const { user } = useImageStore();
  return (
    <Router>
      <div className="absolute">
        <FloatLogin />
        <UserProfile />
      </div>
      <RoutesConfig />
      <div className="z-50">
        <ToastContainer />
      </div>
      <AuthLogin />
      <UserCreateForm />
      {user && <SettingsProfile />}
      <Footer />
    </Router>
  );
}

export default App;
