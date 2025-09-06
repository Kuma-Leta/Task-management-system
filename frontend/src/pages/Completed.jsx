// src/pages/Completed.jsx
import React, { useEffect, useState } from "react";
import { useProject } from "../contexts/ProjectContext";
import axios from "../../axiosConfig";

const COLORS = {
  primary: "#801A1A",
  secondary: "#F6C026",
  high: "#E53E3E",
  medium: "#DD6B20",
  low: "#38A169",
  text: "#2D3748",
  cardBg: "#ffffff",
};

const Completed = () => {
  const { selectedProject } = useProject();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedProject) {
      const fetchCompletedTasks = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `/api/v1/tasks/?project=${selectedProject._id}&status=completed`
          );
          setTasks(response.data.data.tasks);
        } catch (error) {
          console.error("Error fetching completed tasks:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCompletedTasks();
    }
  }, [selectedProject]);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return COLORS.high;
      case "medium":
        return COLORS.medium;
      case "low":
        return COLORS.low;
      default:
        return COLORS.secondary;
    }
  };

  if (loading) return <p className="text-gray-600">Loading tasks...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.primary }}>
        Completed Tasks
      </h1>
      <p className="text-gray-600 mb-6">View all your finished tasks here.</p>

      {tasks.length === 0 ? (
        <p className="text-gray-600">No completed tasks yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  {task.title}
                </h2>
                <p className="text-gray-600 mb-2">{task.description}</p>
                <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-2">
                  <span>
                    Deadline: {new Date(task.deadline).toLocaleDateString()}
                  </span>
                  <span>
                    Assigned To: {task.assignedTo?.name || "Unassigned"} (
                    {task.assignedTo?.email || "N/A"})
                  </span>
                </div>
              </div>
              <span
                className="self-start px-3 py-1 rounded-full text-white text-sm font-medium"
                style={{ backgroundColor: getPriorityColor(task.priority) }}
              >
                {task.priority || "Medium"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Completed;
