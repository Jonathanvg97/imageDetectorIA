import { useEffect, useState } from "react";
import { SettingOpenIcon } from "../../assets/icons/settingOpenIcon";
import { SettingCloseIcon } from "../../assets/icons/settingCloseIcon";
import { OptionsSettings } from "../optionsSettings/optionsSettings";
import { useImageStore } from "../../stores/useImageStore";

export const SettingsProfile = () => {
  //Hook
  const { modalUserCreate, modalUserLogin } = useImageStore();
  //Local state
  const [openSettings, setOpenSettings] = useState(false);
  //
  const isModalsOpen = modalUserCreate || modalUserLogin;

  // Funciones
  const handleOpenSettings = () => {
    setOpenSettings((prevState) => !prevState);
  };
  // Detectar si los modales están abiertos y ajustar la visibilidad de los ajustes
  useEffect(() => {
    if (modalUserCreate || modalUserLogin) {
      setOpenSettings(false);
    }
  }, [modalUserCreate, modalUserLogin]);

  //Ui
  return (
    <div className="SettingsProfile ">
      <div className=" absolute top-4 right-4 ">
        <button
          onClick={handleOpenSettings}
          className={`transform transition-transform duration-300 ease-in-out hover:cursor-pointer hover:scale-110 ${
            !openSettings ? "rotate-180" : "rotate-0"
          }`}
        >
          {!openSettings ? <SettingOpenIcon /> : <SettingCloseIcon />}
        </button>
      </div>
      {openSettings && !isModalsOpen && (
        <OptionsSettings openSettings={openSettings} />
      )}
    </div>
  );
};
