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
  const { loadingOAuth, modalUserLogin, user } = useImageStore();
  return (
    <Router>
      <div className="absolute">
        <FloatLogin />
        <UserProfile />
      </div>
      {user && <SettingsProfile />}

      <ToastContainer />
      {!loadingOAuth && modalUserLogin ? (
        <AuthLogin>
          <RoutesConfig />
          <Footer />
        </AuthLogin>
      ) : (
        <UserCreateForm />
      )}
    </Router>
  );
}

export default App;
