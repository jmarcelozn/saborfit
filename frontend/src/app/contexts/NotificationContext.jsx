import { createContext, useContext, useState, useCallback, useEffect } from "react";
import "@/styles/components/notification.css";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState({
    message: "",
    type: "info",
    visible: false,
  });

  const showNotification = useCallback((message, type = "info") => {
    setNotification({ message, type, visible: true });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification((current) => ({ ...current, visible: false }));
  }, []);

  useEffect(() => {
    import("@/app/services/notificationService").then((mod) => {
      mod.registerNotificationHandler(showNotification);
    });
  }, [showNotification]);

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {notification.visible && (
        <div className={`notification-overlay notification-${notification.type}`}>
          <div className="notification-modal">
            <p>{notification.message}</p>
            <button className="notification-button" onClick={hideNotification}>
              Fechar
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
