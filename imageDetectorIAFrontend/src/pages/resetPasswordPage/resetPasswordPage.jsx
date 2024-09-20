import { useLocation, useNavigate } from "react-router-dom";
import { Footer } from "../../components/footer/footer";
import { useForm } from "react-hook-form";
import { resetPassword } from "../../server/resetPasword";
import { toast } from "react-toastify";

export const ResetPasswordPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();
  // Obtener la ubicación actual de la url actual
  const location = useLocation();

  const getTokenFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get("token");
  };

  // Obtener el token de la url
  const token = getTokenFromUrl();

  const handleResetPassword = async (formData) => {
    try {
      const response = await resetPassword({
        newPassword: formData.password,
        token: token,
      });

      if (response) {
        toast.success("Password reset successfully");
        reset();
        navigate("/");
      } else {
        toast.error("Error resetting password");
      }
    } catch (error) {
      toast.error(error.message || "Error resetting password");
    }
  };

  return (
    <div className="ResetPasswordPage p-4">
      <h1 className="text-4xl font-bold mb-4 text-center text-white flex justify-center z-50 mt-10 relative">
        Image Detector IA
      </h1>
      <div className=" UserCreateForm">
        <div className=" form-container absolute z-50">
          <p className="title">Reset Password</p>
          <form className="form" onSubmit={handleSubmit(handleResetPassword)}>
            {/* Campo de password */}
            <div className="input-group mb-8">
              <label>Password</label>
              <input
                autoComplete="off"
                type="password"
                name="password"
                id="password"
                placeholder="Contraseña"
                {...register("password", {
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                  validate: {
                    minLength: (value) =>
                      value.length >= 8 ||
                      "Password must be at least 8 characters.",
                    hasUpperCase: (value) =>
                      /[A-Z]/.test(value) ||
                      "Password must contain at least one uppercase letter.",
                    hasLowerCase: (value) =>
                      /[a-z]/.test(value) ||
                      "Password must contain at least one lowercase letter.",
                    hasNumber: (value) =>
                      /\d/.test(value) ||
                      "Password must contain at least one number.",
                    hasSpecialChar: (value) =>
                      /[@$!%*?&]/.test(value) ||
                      "Password must contain at least one special character (@$!%*?&).",
                  },
                })}
              />

              {/* Mostrar todos los errores progresivamente */}
              <span className="text-red-500 text-xs">
                {errors.password?.type === "minLength" &&
                  errors.password.message}
                {errors.password?.type === "hasUpperCase" &&
                  errors.password.message}
                {errors.password?.type === "hasLowerCase" &&
                  errors.password.message}
                {errors.password?.type === "hasNumber" &&
                  errors.password.message}
                {errors.password?.type === "hasSpecialChar" &&
                  errors.password.message}
              </span>

              {/* Mensaje explicativo sobre los requisitos de la contraseña */}
              <span className="text-gray-500 text-xs flex mt-3">
                The password must be at least 8 characters long, include at
                least one uppercase letter, one lowercase letter, one number,
                and one special character (@$!%*?&).
              </span>
            </div>

            {/* Campo de confirmar password */}
            <div className="input-group mb-8">
              <label>Confirm Password</label>
              <input
                autoComplete="off"
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: {
                    value: true,
                    message: "Confirm Password is required",
                  },
                  validate: (value) =>
                    value === watch("password") || "The passwords do not match",
                })}
              />

              {/* Mostrar todos los errores progresivamente */}
              <span className="text-red-500 text-xs">
                {errors.confirmPassword?.type === "validate" &&
                  errors.confirmPassword.message}
              </span>
            </div>

            {/* Botón de cambiar contrasena */}
            <button className="sign">Change Password</button>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};
