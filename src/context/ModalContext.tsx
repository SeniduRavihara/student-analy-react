import CustomModal, { ModalType } from "@/components/ui/custom-modal";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

export interface ModalOptions {
  type: ModalType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  inputValue?: string;
  inputPlaceholder?: string;
  inputType?: "text" | "password" | "email" | "number";
}

interface ModalContextType {
  showModal: (options: ModalOptions) => Promise<boolean | string>;
  showAlert: (title: string, message: string) => Promise<void>;
  showConfirm: (title: string, message: string) => Promise<boolean>;
  showPrompt: (
    title: string,
    message: string,
    defaultValue?: string,
    placeholder?: string
  ) => Promise<string | null>;
  showSuccess: (title: string, message: string) => Promise<void>;
  showError: (title: string, message: string) => Promise<void>;
  showWarning: (title: string, message: string) => Promise<void>;
  showInfo: (title: string, message: string) => Promise<void>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [modal, setModal] = useState<ModalOptions | null>(null);
  const [resolve, setResolve] = useState<((value: any) => void) | null>(null);

  const showModal = useCallback(
    (options: ModalOptions): Promise<boolean | string> => {
      return new Promise((res) => {
        setModal(options);
        setResolve(() => res);
      });
    },
    []
  );

  const handleClose = useCallback(() => {
    setModal(null);
    if (resolve) {
      resolve(false);
      setResolve(null);
    }
  }, [resolve]);

  const handleConfirm = useCallback(
    (value?: string) => {
      setModal(null);
      if (resolve) {
        if (modal?.type === "prompt") {
          resolve(value || "");
        } else {
          resolve(true);
        }
        setResolve(null);
      }
    },
    [resolve, modal]
  );

  // Convenience methods
  const showAlert = useCallback(
    (title: string, message: string): Promise<void> => {
      return new Promise((res) => {
        setModal({ type: "alert", title, message });
        setResolve(() => res);
      });
    },
    []
  );

  const showConfirm = useCallback(
    (title: string, message: string): Promise<boolean> => {
      return new Promise((res) => {
        setModal({
          type: "confirm",
          title,
          message,
          confirmText: "Yes",
          cancelText: "No",
        });
        setResolve(() => res);
      });
    },
    []
  );

  const showPrompt = useCallback(
    (
      title: string,
      message: string,
      defaultValue: string = "",
      placeholder: string = ""
    ): Promise<string | null> => {
      return new Promise((res) => {
        setModal({
          type: "prompt",
          title,
          message,
          inputValue: defaultValue,
          inputPlaceholder: placeholder,
          confirmText: "OK",
          cancelText: "Cancel",
        });
        setResolve(() => res);
      });
    },
    []
  );

  const showSuccess = useCallback(
    (title: string, message: string): Promise<void> => {
      return new Promise((res) => {
        setModal({ type: "success", title, message });
        setResolve(() => res);
      });
    },
    []
  );

  const showError = useCallback(
    (title: string, message: string): Promise<void> => {
      return new Promise((res) => {
        setModal({ type: "error", title, message });
        setResolve(() => res);
      });
    },
    []
  );

  const showWarning = useCallback(
    (title: string, message: string): Promise<void> => {
      return new Promise((res) => {
        setModal({ type: "warning", title, message });
        setResolve(() => res);
      });
    },
    []
  );

  const showInfo = useCallback(
    (title: string, message: string): Promise<void> => {
      return new Promise((res) => {
        setModal({ type: "info", title, message });
        setResolve(() => res);
      });
    },
    []
  );

  return (
    <ModalContext.Provider
      value={{
        showModal,
        showAlert,
        showConfirm,
        showPrompt,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      {modal && (
        <CustomModal
          isOpen={!!modal}
          onClose={handleClose}
          onConfirm={handleConfirm}
          type={modal.type}
          title={modal.title}
          message={modal.message}
          confirmText={modal.confirmText}
          cancelText={modal.cancelText}
          inputValue={modal.inputValue}
          inputPlaceholder={modal.inputPlaceholder}
          inputType={modal.inputType}
        />
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
