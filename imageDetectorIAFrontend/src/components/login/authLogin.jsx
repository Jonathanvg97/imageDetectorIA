// src/components/login/authLogin.js
import { GoogleLogin } from "@react-oauth/google";
import "./authLogin.css";
import { CloseIcon } from "../../assets/icons";
import { useImageStore } from "../../stores/useImageStore";
import { useAuth } from "../../hooks/useAuth";
import { LoaderSignUp } from "../utils/loader/loadersLogin/loaderSignUp";

// eslint-disable-next-line react/prop-types
export const AuthLogin = ({ children }) => {
  // Hooks
  const { handleLoginSuccess } = useAuth();
  const { closeModalGoogle, setCloseModalGoogle, loadingAuth } =
    useImageStore();

  // Functions
  const handleCloseModal = () => {
    setCloseModalGoogle(true);
  };

  // UI
  return (
    <>
      {!loadingAuth ? (
        <div className="authLogin">
          {!closeModalGoogle && (
            <div className="form-container absolute z-50">
              <div className="absolute top-0 right-0 p-2">
                <button onClick={handleCloseModal}>
                  <CloseIcon />
                </button>
              </div>
              <p className="title">Login</p>
              <form className="form" onSubmit={(e) => e.preventDefault()}>
                {/* Campo de email */}
                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Correo Electrónico"
                  />
                </div>
                {/* Campo de password */}
                <div className="input-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Contraseña"
                  />
                  <div className="forgot">
                    <a rel="noopener noreferrer" href="#">
                      Forgot Password?
                    </a>
                  </div>
                </div>
                {/* Botón de login */}
                <button className="sign">Sign in</button>
              </form>
              {/* Opciones de login */}
              <div className="social-message">
                <div className="line"></div>
                <p className="message">Login with social accounts</p>
                <div className="line"></div>
              </div>
              {/* Iconos de login */}
              <div className="social-icons my-2">
                <GoogleLogin
                  size="medium"
                  theme="outline"
                  buttonText="Log in with Google"
                  type="icon"
                  onSuccess={handleLoginSuccess}
                  onError={() => console.log("Login Failed")}
                  prompt="consent"
                  scope="openid profile email"
                />
              </div>
              {/* Opción para crear una cuenta */}
              <p className="signup flex flex-col">
                Don’t have an account?{" "}
                <a rel="noopener noreferrer" href="#">
                  Sign up
                </a>
              </p>
            </div>
          )}
          <div
            className={`w-full h-full ${
              closeModalGoogle ? "opacity-100" : "opacity-60"
            }`}
          >
            {children}
          </div>
        </div>
      ) : (
        <LoaderSignUp message="Logging in ..." />
      )}
    </>
  );
};
