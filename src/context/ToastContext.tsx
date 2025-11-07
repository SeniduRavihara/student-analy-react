import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, "id">) => void;
  success: (title: string, description?: string, duration?: number) => void;
  error: (title: string, description?: string, duration?: number) => void;
  warning: (title: string, description?: string, duration?: number) => void;
  info: (title: string, description?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = (++toastId).toString();
    const newToast: Toast = {
      id,
      ...toast,
    };

    setToasts((prev) => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    (toast: Omit<Toast, "id">) => {
      addToast(toast);
    },
    [addToast]
  );

  // Convenience methods
  const success = useCallback(
    (title: string, description?: string, duration?: number) => {
      toast({ type: "success", title, description, duration });
    },
    [toast]
  );

  const error = useCallback(
    (title: string, description?: string, duration?: number) => {
      toast({ type: "error", title, description, duration });
    },
    [toast]
  );

  const warning = useCallback(
    (title: string, description?: string, duration?: number) => {
      toast({ type: "warning", title, description, duration });
    },
    [toast]
  );

  const info = useCallback(
    (title: string, description?: string, duration?: number) => {
      toast({ type: "info", title, description, duration });
    },
    [toast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        toast,
        success,
        error,
        warning,
        info,
        removeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
