import React, { useState, useEffect, useContext } from "react";
import { useProject } from "../../contexts/ProjectContext";
import axios from "../../../axiosConfig";
import { FaBell, FaUserCircle, FaTimes, FaCheck } from "react-icons/fa";
import io from "socket.io-client";
import { decodeToken } from "../../utils/decodeToken";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import api_url from "../../utils/constant";

// Color constants for consistency
const COLORS = {
  primary: "#801A1A", // Main blue
  primaryDark: "#2980b9", // Darker blue
  secondary: "#F6C026", // Green for success
  danger: "#e74c3c", // Red for errors
  dark: "#2c3e50", // Dark background
  light: "#ecf0f1", // Light background
  textDark: "#2c3e50", // Dark text
  textLight: "#ffffff", // Light text
  gray: "#95a5a6", // Gray for borders
  lightGray: "#bdc3c7", // Light gray
};

const socket = io(`${api_url}`); // Connect to the Socket.IO server

const Topbar = () => {
  const { projects, selectedProject, selectProject, refreshProjects } =
    useProject();
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  // Fetch all users for the members dropdown
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/v1/auth/getUsers");
      setUsers(response.data.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle form submission
  const handleCreateProject = async () => {
    try {
      await axios.post("/api/v1/project", {
        name: projectName,
        description,
        deadline,
        schedule: {
          startDate,
          endDate,
        },
        members,
      });

      // Clear form fields
      setProjectName("");
      setDescription("");
      setDeadline("");
      setStartDate("");
      setEndDate("");
      setMembers([]);

      // Show success message
      setSuccessMessage("Project created successfully!");
      setErrorMessage("");

      // Refresh the project list
      refreshProjects();

      // Close the modal after 2 seconds
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error creating project:", error);
      setErrorMessage("Failed to create project. Please try again.");
      setSuccessMessage("");
    }
  };

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

  // Mark a notification as read
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

  // Delete a notification
  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`/api/v1/notifications/${notificationId}`);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.patch("/api/v1/notifications/mark-all-as-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Fetch notifications and set up Socket.IO listeners
  useEffect(() => {
    fetchNotifications();

    // Join the user's room for real-time notifications
    const userToken = decodeToken();
    if (userToken && userToken.id) {
      socket.emit("joinUserRoom", userToken.id);
    }

    // Listen for real-time notifications
    socket.on("receiveNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    // Clean up the listener on unmount
    return () => {
      socket.off("receiveNotification");
    };
  }, []);

  return (
    <div className="w-full top-0 z-50 bg-white border-b border-gray-200 flex justify-between items-center p-4 shadow-sm">
      {/* Project Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Project:</label>
        <select
          value={selectedProject?._id || ""}
          onChange={(e) => selectProject(e.target.value)}
          className="p-2 rounded border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Select your project"
        >
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project?.name}
            </option>
          ))}
        </select>
        {user?.role === "manager" && (
          <button
            title="Create project"
            className="bg-[#801A1A] hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium transition-colors"
            onClick={() => {
              setIsModalOpen(true);
              fetchUsers();
            }}
          >
            + Create Project
          </button>
        )}
      </div>

      {/* Notifications and User Menu */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
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
          {isNotificationsOpen && (
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
                    <div
                      key={notification._id}
                      className={`p-3 border-b border-gray-100 flex justify-between items-start ${
                        notification.read ? "bg-white" : "bg-blue-50"
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-2">
                        {!notification.read && (
                          <button
                            className="text-green-500 hover:text-green-700"
                            onClick={() => markAsRead(notification._id)}
                            title="Mark as read"
                          >
                            <FaCheck size={14} />
                          </button>
                        )}
                        <button
                          className="text-gray-400 hover:text-red-500"
                          onClick={() => deleteNotification(notification._id)}
                          title="Delete notification"
                        >
                          <FaTimes size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <FaUserCircle size={24} className="text-gray-600" />
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </button>
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200 py-1">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profile
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Settings
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to logout?")) {
                    localStorage.removeItem("authToken");
                    navigate("/login");
                  }
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Create Project
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
                  {successMessage}
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-4">
                {/* Project Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Schedule - Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Schedule - End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Members */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Members
                  </label>
                  <select
                    multiple
                    value={members}
                    onChange={(e) => {
                      const selectedMembers = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      );
                      setMembers(selectedMembers);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    size="4"
                  >
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user?.name} ({user.email})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Hold Ctrl/Cmd to select multiple members
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  onClick={handleCreateProject}
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topbar;
