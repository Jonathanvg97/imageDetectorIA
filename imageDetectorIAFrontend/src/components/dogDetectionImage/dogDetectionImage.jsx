import { DogAnimation } from "../utils/dogAnimation";

export const DogDetectionImage = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 mt-3 ">
      <h2 className="text-xl w-80 h-10 text-center font-semibold text-gray-300 mb-6">
        Do you want to detect if there is a dog in the image ?
      </h2>
      <div className="bg-slate-200 rounded-full">
        <DogAnimation />
      </div>

      <div className="mt-4 text-lg text-gray-800 text-center"></div>
    </div>
  );
};
