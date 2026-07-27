import { createContext, useContext, useEffect, useState } from "react";

const NotificationContext = createContext({
  unreadCount: 0,
  setUnreadCount: () => {},
  refreshNotifications: () => {},
});

export function NotificationProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);

  // Temporary Sprint 42.6 fix:
  // Always reset the badge on application start.
  // Once we locate the component generating notifications,
  // we'll replace this with the real unread count.
  useEffect(() => {
    setUnreadCount(0);
  }, []);

  function refreshNotifications(count = 0) {
    setUnreadCount(Number(count) || 0);
  }

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        setUnreadCount,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationBadge() {
  return useContext(NotificationContext);
}
