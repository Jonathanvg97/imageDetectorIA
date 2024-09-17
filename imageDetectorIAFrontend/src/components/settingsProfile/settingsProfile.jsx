import { useState } from "react";
import { SettingOpenIcon } from "../../assets/icons/settingOpenIcon";
import { SettingCloseIcon } from "../../assets/icons/settingCloseIcon";
import { OptionsSettings } from "../optionsSettings/optionsSettings";

export const SettingsProfile = () => {
  //Local state
  const [openSettings, setOpenSettings] = useState(false);

  //Funciones
  const handleOpenSettings = () => {
    setOpenSettings(!openSettings);
  };

  //Ui
  return (
    <div className="SettingsProfile relative">
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
      {openSettings && (
        <div
          className={`absolute top-2 right-14 transition-transform duration-500 ease-in-out transform ${
            openSettings
              ? "translate-x-0 opacity-100"
              : "translate-x-40 opacity-0"
          }`}
        >
          <OptionsSettings />
        </div>
      )}
    </div>
  );
};
