import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import React from "react";

export type ModalType =
  | "alert"
  | "confirm"
  | "prompt"
  | "success"
  | "error"
  | "warning"
  | "info";

export interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (value?: string) => void;
  type: ModalType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  inputValue?: string;
  inputPlaceholder?: string;
  inputType?: "text" | "password" | "email" | "number";
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  title,
  message,
  confirmText = "OK",
  cancelText = "Cancel",
  inputValue = "",
  inputPlaceholder = "",
  inputType = "text",
}) => {
  const [inputVal, setInputVal] = React.useState(inputValue);

  React.useEffect(() => {
    setInputVal(inputValue);
  }, [inputValue]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "error":
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case "info":
        return <Info className="h-6 w-6 text-blue-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-blue-500" />;
    }
  };

  const getButtonColors = () => {
    switch (type) {
      case "success":
        return "bg-green-600 hover:bg-green-700 text-white";
      case "error":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700 text-white";
      case "info":
        return "bg-blue-600 hover:bg-blue-700 text-white";
      default:
        return "bg-blue-600 hover:bg-blue-700 text-white";
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      if (type === "prompt") {
        onConfirm(inputVal);
      } else {
        onConfirm();
      }
    }
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (type === "prompt" || type === "alert")) {
      handleConfirm();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all"
        onKeyDown={handleKeyPress}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">{message}</p>

          {/* Input for prompt type */}
          {type === "prompt" && (
            <div className="mb-4">
              <input
                type={inputType}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={inputPlaceholder}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          {(type === "confirm" || type === "prompt") && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              getButtonColors()
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
