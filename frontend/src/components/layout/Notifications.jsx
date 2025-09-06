import React, { useState, useEffect } from "react";
import { FaBell, FaCheck, FaTimes } from "react-icons/fa";
import io from "socket.io-client";
import { decodeToken } from "../../utils/decodeToken";
import axios from "../../../axiosConfig";
import api_url from "../../utils/constant";

const socket = io(`${api_url}`);

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/v1/notifications");
      const fetchedNotifications = response.data.data.notifications;
      setNotifications(fetchedNotifications);
      const unread = fetchedNotifications.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`/api/v1/notifications/${notificationId}/mark-as-read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`/api/v1/notifications/${notificationId}`);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch("/api/v1/notifications/mark-all-as-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const userToken = decodeToken();
    if (userToken && userToken.id) {
      socket.emit("joinUserRoom", userToken.id);
    }

    socket.on("receiveNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.off("receiveNotification");
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-blue-500 focus:outline-none relative transition-colors"
        title="View notifications"
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-blue-500 text-sm font-medium hover:text-blue-700"
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => (
  <div
    className={`p-3 border-b border-gray-100 flex justify-between items-start ${
      notification.read ? "bg-white" : "bg-blue-50"
    }`}
  >
    <div className="flex-1">
      <p className="text-sm text-gray-800">{notification.message}</p>
      <p className="text-xs text-gray-500 mt-1">
        {new Date(notification.createdAt).toLocaleString()}
      </p>
    </div>
    <div className="flex gap-2 ml-2">
      {!notification.read && (
        <button
          className="text-green-500 hover:text-green-700"
          onClick={() => onMarkAsRead(notification._id)}
          title="Mark as read"
        >
          <FaCheck size={14} />
        </button>
      )}
      <button
        className="text-gray-400 hover:text-red-500"
        onClick={() => onDelete(notification._id)}
        title="Delete notification"
      >
        <FaTimes size={14} />
      </button>
    </div>
  </div>
);

export default Notifications;
