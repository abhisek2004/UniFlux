import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (type: ToastType, title: string, message: string, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback((type: ToastType, title: string, message: string, duration = 4000) => {
        const id = Date.now().toString();
        const newToast = { id, type, title, message, duration };
        setToasts((prev) => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

interface ToastContainerProps {
    toasts: Toast[];
    removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none px-4 sm:px-0">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
            pointer-events-auto transform transition-all duration-300 ease-in-out
            flex items-start p-4 rounded-lg border shadow-lg relative overflow-hidden
            animate-slide-in
            ${getToastStyles(toast.type)}
          `}
                    role="alert"
                >
                    <div className="flex-shrink-0 mr-3">
                        {getToastIcon(toast.type)}
                    </div>
                    <div className="flex-1 mr-2">
                        <h4 className="text-sm font-semibold">{toast.title}</h4>
                        <p className="text-sm mt-1 opacity-90">{toast.message}</p>
                    </div>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="flex-shrink-0 ml-auto focus:outline-none opacity-60 hover:opacity-100 transition-opacity"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ))}
        </div>
    );
};

const getToastStyles = (type: ToastType): string => {
    switch (type) {
        case 'success':
            return 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200';
        case 'error':
            return 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
        case 'warning':
            return 'bg-secondary-50 dark:bg-yellow-900/30 border-secondary-200 dark:border-yellow-800 text-secondary-800 dark:text-yellow-200';
        case 'info':
            return 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
        default:
            return 'bg-white border-gray-200 text-gray-800';
    }
};

const getToastIcon = (type: ToastType) => {
    switch (type) {
        case 'success':
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        case 'error':
            return <AlertCircle className="h-5 w-5 text-red-500" />;
        case 'warning':
            return <AlertTriangle className="h-5 w-5 text-secondary-500" />;
        case 'info':
            return <Info className="h-5 w-5 text-blue-500" />;
    }
};
