import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import "@/styles/components/notification.css";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState({
    message: "",
    type: "info",
    visible: false,
  });

  const showNotification = useCallback((message, type = "info", duration = 4000) => {
    setNotification({ message, type, visible: true });

    if (duration > 0) {
      setTimeout(() => {
        setNotification((current) => ({ ...current, visible: false }));
      }, duration);
    }
  }, []);

  const hideNotification = useCallback(() => {
    setNotification((current) => ({ ...current, visible: false }));
  }, []);

  useEffect(() => {
    import("@/app/services/notificationService").then((mod) => {
      mod.registerNotificationHandler(showNotification);
    });
  }, [showNotification]);

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle size={24} />;
      case "error":
        return <XCircle size={24} />;
      default:
        return <Info size={24} />;
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {notification.visible && (
        <div className={`notification-overlay notification-${notification.type}`}>
          <div className="notification-modal">
            <div className="notification-icon">
              {getIcon()}
            </div>
            <div className="notification-content">
              <p className="notification-message">{notification.message}</p>
            </div>
            <button
              className="notification-close"
              onClick={hideNotification}
              aria-label="Fechar notificação"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
}
