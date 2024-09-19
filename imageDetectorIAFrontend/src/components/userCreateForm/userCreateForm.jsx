// src/components/login/userCreateForm.js
import { useForm } from "react-hook-form";
import "./userCreateForm.css";
import { CloseIcon } from "../../assets/icons";
import { useImageStore } from "../../stores/useImageStore";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { Footer } from "../footer/footer";

export const UserCreateForm = () => {
  // Hooks
  const {
    handleCloseModalCreateAccount,
    handleCloseModalUpdateAccount,
    handleUserCreate,
    handleUpdateUser,
  } = useAuth();
  const { modalUserCreate, editionMode } = useImageStore();

  //Local state
  const [editionData, setEditionData] = useState(null);
  const [addPhoto, setAddPhoto] = useState(false);
  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
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

  // Cargar y actualizar datos de edición cuando `editionMode` sea `true`
  useEffect(() => {
    if (editionMode) {
      const editionDataString = sessionStorage.getItem("user");
      if (editionDataString) {
        const parsedData = JSON.parse(editionDataString);
        setEditionData(parsedData);
        setAddPhoto(parsedData.picture ? true : false);
      }
    } else {
      setEditionData(null);
      setAddPhoto(false);
    }
  }, [editionMode]);

  // Actualizar valores del formulario cuando `editionData` cambie
  useEffect(() => {
    if (editionData) {
      reset({
        email: editionData.email || "",
        username: editionData.name || "",
        photofile: editionData.picture ? true : false,
        userPhoto: editionData.picture || "",
      });
    }
  }, [editionData, reset]);

  //Function for checking if photo is added
  const handleAddPhoto = () => {
    setAddPhoto(!addPhoto);
  };
  const onSubmitFormUser = async (data) => {
    const { email, password, username, userPhoto } = data;
    let result;

    try {
      if (!editionMode) {
        // Handle user creation and wait for the response
        result = await handleUserCreate({
          email,
          name: username,
          password,
          userPhoto,
        });
      } else {
        // Handle user update and wait for the response
        result = await handleUpdateUser({
          name: username,
          picture: userPhoto,
        });
      }

      if (result !== null) {
        reset();
      } else {
        // Handle unsuccessful response if needed
        console.error("Operation failed.");
      }
    } catch (error) {
      // Handle errors
      console.error("An error occurred:", error);
    }
  };

  // UI
  return (
    <>
      {modalUserCreate && (
        <div className="UserCreateForm">
          <div className=" form-container absolute z-50">
            <div className="absolute top-0 right-0 p-2">
              <button
                onClick={
                  !editionMode
                    ? handleCloseModalCreateAccount
                    : handleCloseModalUpdateAccount
                }
              >
                <CloseIcon />
              </button>
            </div>
            <p className="title">
              {!editionMode ? "Create Account" : "Update Account"}
            </p>
            <form className="form" onSubmit={handleSubmit(onSubmitFormUser)}>
              {/* Campo de email */}
              <div className="input-group">
                <label>Email</label>
                <input
                  disabled={editionMode}
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
                    {!editionMode
                      ? "you want add a user photo"
                      : "you want update a user photo"}
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
                <div className="input-group mb-3">
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
              {!editionMode && (
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
                    least one uppercase letter, one lowercase letter, one
                    number, and one special character (@$!%*?&).
                  </span>
                </div>
              )}

              {/* Botón de login */}
              <button className="sign">
                {editionMode ? "Update profile" : "Create account"}
              </button>
            </form>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};
