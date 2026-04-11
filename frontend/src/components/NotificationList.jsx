import React from 'react';

export default function NotificationList({ notifications }) {
  return (
    <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-[1000] flex flex-col gap-2 sm:gap-3">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`px-3 sm:px-5 py-2 sm:py-3 rounded-xl shadow-lg text-white font-semibold text-xs sm:text-base transition-all animate-fade-in-up
            ${n.type === 'success' ? 'bg-green-600' : n.type === 'error' ? 'bg-red-600' : 'bg-[#222c37]'}`}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}
