import { useForm } from "react-hook-form";
import { Footer } from "../../components/footer/footer";
import { forgotPassword } from "../../server/forgotPassword";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ForgetPasswordPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await forgotPassword(data);
      if (response) {
        toast.success("Email sent successfully");
        reset();
        navigate("/");
      } else {
        toast.error("Error sending email");
      }
      reset();
    } catch (error) {
      toast.error(error.message || "Error sending email");
    }
  };

  //UI
  return (
    <div className="ForgetPasswordPage p-4">
      <h1 className="text-4xl font-bold mb-4 text-center text-white flex justify-center z-50 mt-10 relative">
        Image Detector IA
      </h1>
      <div className=" UserCreateForm">
        <div className=" form-container absolute z-50">
          <p className="title">Forgot Password</p>
          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <div className="input-group mb-5">
              <label>Email</label>
              <input
                autoComplete="off"
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
            <button className="sign">Remember Password</button>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};
