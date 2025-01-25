import { PROMPT_MODES, PROMPT_MODE_LABELS } from "../constants/promptModes";

export const ModeToggle = ({ currentMode, onModeChange }) => {
  return (
    <div className="flex items-center justify-center space-x-4 mb-6">
      {Object.values(PROMPT_MODES).map((mode) => (
        <button
          key={mode}
          onClick={() => onModeChange(mode)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            currentMode === mode
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {PROMPT_MODE_LABELS[mode]}
        </button>
      ))}
    </div>
  );
};
