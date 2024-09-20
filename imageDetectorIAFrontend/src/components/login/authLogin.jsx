// src/components/login/authLogin.js
import { useForm } from "react-hook-form";
import { GoogleLogin } from "@react-oauth/google";
import "./authLogin.css";
import { CloseIcon } from "../../assets/icons";
import { useImageStore } from "../../stores/useImageStore";
import { useAuth } from "../../hooks/useAuth";
import { LoaderSignUp } from "../utils/loader/loadersLogin/loaderSignUp";

export const AuthLogin = () => {
  // Hooks
  const {
    handleLoginSuccessWithGoogle,
    handleLoginSuccessWithoutGoogle,
    handleOpenModalCreateAccount,
  } = useAuth();
  const { loadingAuth, modalUserLogin, setModalUserLogin } = useImageStore();

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Functions
  const handleCloseModal = () => {
    setModalUserLogin(false);
  };

  const onSubmitFormLogin = (data) => {
    const { email, password } = data;
    if (email && password) {
      handleLoginSuccessWithoutGoogle({ email, password });
    }
  };

  // UI
  return (
    <>
      {loadingAuth ? (
        <LoaderSignUp message="Logging in ..." />
      ) : (
        modalUserLogin && (
          <div className="authLogin">
            <div className="form-container absolute z-50">
              <div className="absolute top-0 right-0 p-2">
                <button onClick={handleCloseModal}>
                  <CloseIcon />
                </button>
              </div>
              <p className="title">Login</p>
              <form
                autoComplete="off"
                className="form"
                onSubmit={handleSubmit(onSubmitFormLogin)}
              >
                {/* Campo de email */}
                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Correo Electrónico"
                    {...register("email", {
                      required: {
                        value: true,
                        message: "Email is required",
                      },
                    })}
                  />
                  <span className="text-red-500 text-xs">
                    {errors.email?.message}
                  </span>
                </div>
                {/* Campo de password */}
                <div className="input-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Contraseña"
                    {...register("password", {
                      required: {
                        value: true,
                        message: "Password is required",
                      },
                    })}
                  />
                  <span className="text-red-500 text-xs">
                    {errors.password?.message}
                  </span>
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
                  onSuccess={handleLoginSuccessWithGoogle}
                  onError={() => console.log("Login Failed")}
                  prompt="consent"
                  scope="openid profile email"
                />
              </div>
              {/* Opción para crear una cuenta */}
              <p className="signup flex flex-col">
                Don’t have an account?{" "}
                <button
                  className="text-sky-500 text-sm font-bold"
                  onClick={handleOpenModalCreateAccount}
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        )
      )}
    </>
  );
};
