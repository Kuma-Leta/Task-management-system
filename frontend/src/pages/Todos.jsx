import React, { useEffect, useState, useContext } from "react";
import { useProject } from "../contexts/ProjectContext";
import { AuthContext } from "../contexts/AuthContext";
import axios from "../../axiosConfig";
import {
  FaUser,
  FaClock,
  FaFlag,
  FaCheckCircle,
  FaPlus,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

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

const Todos = () => {
  const { selectedProject } = useProject();
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  // Fetch todos
  useEffect(() => {
    if (selectedProject) {
      const fetchTodos = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `/api/v1/tasks/?project=${selectedProject._id}&status=todos`
          );
          setTasks(response.data.data.tasks);
          setFilteredTasks(response.data.data.tasks);
        } catch (error) {
          console.error("Error fetching todos:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchTodos();
    }
  }, [selectedProject]);

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/v1/auth/getUsers");
        setUsers(response.data.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

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

    // Apply priority filter
    if (priorityFilter !== "all") {
      result = result.filter((task) => task.priority === priorityFilter);
    }

    // Apply assignee filter
    if (assigneeFilter !== "all") {
      result = result.filter((task) =>
        task.assignedTo
          ? task.assignedTo._id === assigneeFilter
          : assigneeFilter === "unassigned"
      );
    }

    setFilteredTasks(result);
  }, [tasks, searchTerm, priorityFilter, assigneeFilter]);

  // Function to assign a user to a task
  const handleAssign = async (taskId, userId) => {
    try {
      const response = await axios.patch(`/api/v1/tasks/${taskId}/assign`, {
        assignedTo: userId,
      });

      // Update the state to reflect the change
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId
            ? { ...task, assignedTo: response.data.data.assignedTo }
            : task
        )
      );
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  // Function to mark task as in progress
  const handleStartTask = async (taskId) => {
    try {
      const response = await axios.patch(`/api/v1/tasks/${taskId}`, {
        status: "in progress",
      });

      // Remove the task from the list
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error starting task:", error);
    }
  };

  // Get priority color and icon
  const getPriorityInfo = (priority) => {
    switch (priority) {
      case "high":
        return {
          color: COLORS.danger,
          icon: <FaFlag className="text-red-500" />,
        };
      case "medium":
        return {
          color: COLORS.warning,
          icon: <FaFlag className="text-yellow-500" />,
        };
      case "low":
        return {
          color: COLORS.success,
          icon: <FaFlag className="text-green-500" />,
        };
      default:
        return {
          color: COLORS.gray,
          icon: <FaFlag className="text-gray-500" />,
        };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if deadline is approaching (within 3 days)
  const isDeadlineApproaching = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  // Check if deadline is overdue
  const isDeadlineOverdue = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    return deadlineDate < today;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: COLORS.primary }}
            >
              To-Do List
            </h1>
            <p className="text-gray-600">
              Manage your pending tasks for{" "}
              {selectedProject?.name || "the selected project"}
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
            </span>
          </div>
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
              <div className="relative flex-grow md:flex-none">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="text-gray-400 text-sm" />
                </div>
                <select
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
              >
                <option value="all">All Assignees</option>
                <option value="unassigned">Unassigned</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Task List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tasks...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => {
                const priorityInfo = getPriorityInfo(task.priority);
                const deadlineApproaching =
                  task.deadline && isDeadlineApproaching(task.deadline);
                const deadlineOverdue =
                  task.deadline && isDeadlineOverdue(task.deadline);

                return (
                  <div
                    key={task._id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h2
                          className="text-xl font-semibold"
                          style={{ color: COLORS.accent }}
                        >
                          {task.title}
                        </h2>
                        <div className="flex items-center">
                          <span
                            className="text-sm font-medium mr-2"
                            style={{ color: priorityInfo.color }}
                          >
                            {task.priority}
                          </span>
                          {priorityInfo.icon}
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{task.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center">
                          <FaClock className="text-gray-400 mr-2" />
                          <span
                            className={`text-sm ${
                              deadlineOverdue
                                ? "text-red-500 font-medium"
                                : deadlineApproaching
                                ? "text-yellow-500 font-medium"
                                : "text-gray-500"
                            }`}
                          >
                            {task.deadline
                              ? formatDate(task.deadline)
                              : "No deadline"}
                            {deadlineOverdue && " (Overdue)"}
                            {deadlineApproaching &&
                              !deadlineOverdue &&
                              " (Soon)"}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <FaUser className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">
                            {task.assignedTo
                              ? task.assignedTo.name
                              : "Unassigned"}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-4 border-t border-gray-100">
                        {user.role === "manager" && (
                          <select
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            onChange={(e) =>
                              handleAssign(task._id, e.target.value)
                            }
                            value={task.assignedTo?._id || ""}
                          >
                            <option value="">Assign to...</option>
                            {users.map((user) => (
                              <option key={user._id} value={user._id}>
                                {user.name} ({user.email})
                              </option>
                            ))}
                          </select>
                        )}

                        <button
                          onClick={() => handleStartTask(task._id)}
                          className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                        >
                          <FaCheckCircle className="mr-2" />
                          Start Task
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-6xl mb-4" style={{ color: COLORS.gray }}>
                  📋
                </div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  No tasks found
                </h3>
                <p className="text-gray-500">
                  {tasks.length === 0
                    ? "No to-do tasks available. Great job!"
                    : "Try adjusting your search or filters."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Todos;
