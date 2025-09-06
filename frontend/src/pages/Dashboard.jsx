import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import StatCard from "../components/shared/StatCard";
import { useProject } from "../contexts/ProjectContext";
import axios from "../../axiosConfig";
import api_url from "../utils/constant";
import {
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaPlus,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

const socket = io(`${api_url}`);

// Color constants for consistency
const COLORS = {
  primary: "#801A1A", // Primary burgundy
  secondary: "#F6C026", // Secondary gold
  accent: "#2D3748", // Dark blue-gray
  light: "#F7FAFC", // Light background
  dark: "#2C3E50", // Dark text
  success: "#38A169", // Green for success
  warning: "#D69E2E", // Yellow for warning
  danger: "#E53E3E", // Red for danger
  gray: "#A0AEC0", // Gray for borders
};

const Dashboard = () => {
  const { selectedProject } = useProject();
  const [taskStats, setTaskStats] = useState({
    totalTasks: 0,
    completed: 0,
    tasksInProgress: 0,
    todos: 0,
  });
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTask, setEditTask] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Fetch tasks and update statistics
  const fetchTaskStats = async () => {
    if (!selectedProject) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `${api_url}/api/v1/tasks/project/${selectedProject._id}`
      );

      const tasks = response.data.data.tasks;
      setTasks(tasks);
      setFilteredTasks(tasks);

      const totalTasks = tasks.length;
      const completed = tasks.filter(
        (task) => task.status === "completed"
      ).length;
      const tasksInProgress = tasks.filter(
        (task) => task.status === "in progress"
      ).length;
      const todos = tasks.filter((task) => task.status === "todos").length;

      setTaskStats({ totalTasks, completed, tasksInProgress, todos });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskStats();
  }, [selectedProject]);

  // Filter tasks based on search and filters
  useEffect(() => {
    let result = tasks;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((task) => task.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      result = result.filter((task) => task.priority === priorityFilter);
    }

    setFilteredTasks(result);
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  // Socket event listeners
  useEffect(() => {
    socket.on("taskUpdated", (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
      fetchTaskStats();
    });

    socket.on("taskDeleted", (taskId) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      fetchTaskStats();
    });

    socket.on("taskCreated", (newTask) => {
      setTasks((prevTasks) => [...prevTasks, newTask]);
      fetchTaskStats();
    });

    return () => {
      socket.off("taskUpdated");
      socket.off("taskDeleted");
      socket.off("taskCreated");
    };
  }, []);

  const confirmDeleteTask = (taskId) => {
    setTaskToDelete(taskId);
    setShowDeletePopup(true);
  };

  // Update task details
  const handleTaskUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedTask = { ...editTask };
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );

      const response = await axios.patch(
        `${api_url}/api/v1/tasks/${editTask._id}`,
        editTask
      );

      socket.emit("updateTask", response.data.data.task);
      setEditTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete a task
  const deleteTask = async () => {
    if (!taskToDelete) return;
    try {
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskToDelete)
      );
      await axios.delete(`${api_url}/api/v1/tasks/${taskToDelete}`);
      socket.emit("deleteTask", taskToDelete);
      setShowDeletePopup(false);
      setTaskToDelete(null);
      fetchTaskStats();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return COLORS.success;
      case "in progress":
        return COLORS.warning;
      case "todos":
        return COLORS.secondary;
      default:
        return COLORS.gray;
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return COLORS.danger;
      case "medium":
        return COLORS.warning;
      case "low":
        return COLORS.success;
      default:
        return COLORS.gray;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: COLORS.primary }}
        >
          Dashboard
        </h1>
        <p className="text-gray-600 mb-8">
          Track your project progress and manage tasks
        </p>

        {/* Task Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="TOTAL TASKS"
            value={taskStats.totalTasks}
            unit="tasks"
            color={COLORS.primary}
            icon="📋"
          />
          <StatCard
            title="COMPLETED"
            value={taskStats.completed}
            unit="tasks"
            color={COLORS.success}
            icon="✅"
          />
          <StatCard
            title="IN PROGRESS"
            value={taskStats.tasksInProgress}
            unit="tasks"
            color={COLORS.warning}
            icon="🔄"
          />
          <StatCard
            title="TO DO"
            value={taskStats.todos}
            unit="tasks"
            color={COLORS.secondary}
            icon="⏳"
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="text-gray-400 text-sm" />
                </div>
                <select
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="todos">To Do</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2
              className="text-xl font-semibold"
              style={{ color: COLORS.accent }}
            >
              Tasks {filteredTasks.length > 0 && `(${filteredTasks.length})`}
            </h2>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading tasks...</p>
            </div>
          ) : (
            <div className="p-6">
              {filteredTasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTasks.map((task) => (
                    <div
                      key={task._id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3
                          className="font-semibold text-lg"
                          style={{ color: COLORS.accent }}
                        >
                          {task.title}
                        </h3>
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${getPriorityColor(
                              task.priority
                            )}20`,
                            color: getPriorityColor(task.priority),
                          }}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4">{task.description}</p>

                      <div className="flex justify-between items-center mb-4">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${getStatusColor(task.status)}20`,
                            color: getStatusColor(task.status),
                          }}
                        >
                          {task.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(task.updatedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <button
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          onClick={() => setEditTask(task)}
                          title="Edit task"
                        >
                          <FaEdit className="text-blue-500" />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          onClick={() => confirmDeleteTask(task._id)}
                          title="Delete task"
                        >
                          <FaTrash className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4" style={{ color: COLORS.gray }}>
                    📋
                  </div>
                  <h3 className="text-xl font-medium text-gray-600 mb-2">
                    No tasks found
                  </h3>
                  <p className="text-gray-500">
                    {tasks.length === 0
                      ? "Get started by creating your first task."
                      : "Try adjusting your search or filters."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center mb-4">
              <div className="rounded-full p-2 bg-red-100 mr-3">
                <FaTrash className="text-red-500 text-lg" />
              </div>
              <h2 className="text-xl font-semibold">Confirm Deletion</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this task? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
                onClick={deleteTask}
              >
                <FaTrash className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Edit Task</h2>
              <button
                onClick={() => setEditTask(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <form onSubmit={handleTaskUpdate} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editTask.title}
                    onChange={(e) =>
                      setEditTask({ ...editTask, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editTask.description}
                    onChange={(e) =>
                      setEditTask({ ...editTask, description: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editTask.status}
                      onChange={(e) =>
                        setEditTask({ ...editTask, status: e.target.value })
                      }
                    >
                      <option value="todos">To Do</option>
                      <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editTask.priority}
                      onChange={(e) =>
                        setEditTask({ ...editTask, priority: e.target.value })
                      }
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setEditTask(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                >
                  <FaCheck className="mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
