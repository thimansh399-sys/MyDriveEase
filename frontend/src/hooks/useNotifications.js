import { useState, useCallback } from 'react';

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info') => {
    setNotifications((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), message, type }
    ]);
    setTimeout(() => {
      setNotifications((prev) => prev.slice(1));
    }, 4000);
  }, []);

  return { notifications, addNotification };
}
