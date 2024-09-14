// src/components/login/userCreateForm.js
import { useForm } from "react-hook-form";
import "./userCreateForm.css";
import { CloseIcon } from "../../assets/icons";
import { useImageStore } from "../../stores/useImageStore";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

export const UserCreateForm = () => {
  // Hooks
  const { handleCloseModalCreateAccount, handleUserCreate } = useAuth();
  const { modalUserCreate, modalUserLogin } = useImageStore();

  const [addPhoto, setAddPhoto] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      username: "",
      photofile: false,
      userPhoto: "",
    },
  });

  //Function for checking if photo is added
  const handleAddPhoto = () => {
    setAddPhoto(!addPhoto);
  };
  const onSubmitFormCreateUser = (data) => {
    console.log(data);
    const { email, password, username, userPhoto } = data;
    console.log(data);
    handleUserCreate({ email, name: username, password, userPhoto });
  };

  // UI
  return (
    <>
      {modalUserCreate && !modalUserLogin && (
        <div className="UserCreateForm">
          <div className=" form-container absolute z-50">
            <div className="absolute top-0 right-0 p-2">
              <button onClick={handleCloseModalCreateAccount}>
                <CloseIcon />
              </button>
            </div>
            <p className="title">Create Account</p>
            <form
              className="form"
              onSubmit={handleSubmit(onSubmitFormCreateUser)}
            >
              {/* Campo de email */}
              <div className="input-group">
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
              {/* Campo de nickname */}
              <div className="input-group">
                <label>Username</label>
                <input
                  autoComplete="off"
                  type="text"
                  placeholder="username"
                  {...register("username", {
                    required: {
                      value: true,
                      message: "username is required",
                    },
                  })}
                />
                <span className="text-red-500 text-xs">
                  {errors.username?.message}
                </span>
              </div>
              {/* checkbox  do you add a user photo? */}
              <div className="input-group flex ">
                <div className="w-full justify-evenly flex mt-3 items-center ">
                  <label className="w-full whitespace-nowrap">
                    Do you want add a user photo?
                  </label>
                  <input
                    className=""
                    onClick={handleAddPhoto}
                    type="checkbox"
                    name="photofile"
                    placeholder="Photo"
                    {...register("photofile", {
                      required: {
                        value: false,
                      },
                    })}
                  />
                </div>
              </div>
              {/* Campo de photofile  */}
              {/* verify if checkbox is checked , should view a file input */}
              {addPhoto && (
                <div className="input-group">
                  <label>Photo</label>
                  <input
                    type="file"
                    name="userPhoto"
                    placeholder="Photo"
                    {...register("userPhoto", {
                      validate: (value) =>
                        addPhoto && !value?.length
                          ? "User photo is required"
                          : true, // Condicional para mostrar error si no se sube foto y `addPhoto` es true
                    })}
                  />
                  <span className="text-red-500 text-xs">
                    {errors.userPhoto?.message}
                  </span>
                </div>
              )}
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

              {/* Botón de login */}
              <button className="sign">Create account</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
