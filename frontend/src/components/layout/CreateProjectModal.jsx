import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "../../../axiosConfig";

const CreateProjectModal = ({ onClose, refreshProjects }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    deadline: "",
    startDate: "",
    endDate: "",
    members: [],
  });
  const [users, setUsers] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/v1/auth/getUsers");
      setUsers(response.data.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setErrorMessage("Project name is required");
      return false;
    }
    if (!formData.description.trim()) {
      setErrorMessage("Description is required");
      return false;
    }
    if (!formData.deadline) {
      setErrorMessage("Deadline is required");
      return false;
    }
    if (!formData.startDate) {
      setErrorMessage("Start date is required");
      return false;
    }
    if (!formData.endDate) {
      setErrorMessage("End date is required");
      return false;
    }

    // Date validation
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setErrorMessage("Start date cannot be after end date");
      return false;
    }
    if (new Date(formData.deadline) < new Date(formData.endDate)) {
      setErrorMessage("Deadline cannot be before project end date");
      return false;
    }

    return true;
  };

  const handleCreateProject = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/v1/project", {
        name: formData.name,
        description: formData.description,
        deadline: formData.deadline,
        schedule: {
          startDate: formData.startDate,
          endDate: formData.endDate,
        },
        members: formData.members,
      });

      setSuccessMessage("Project created successfully!");
      setErrorMessage("");
      refreshProjects();

      setTimeout(() => {
        onClose();
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error creating project:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to create project. Please try again.";
      setErrorMessage(errorMsg);
      setSuccessMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errorMessage) setErrorMessage("");
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Create Project
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={isSubmitting}
            >
              <FaTimes size={20} />
            </button>
          </div>

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
              {errorMessage}
            </div>
          )}

          <div className="space-y-4">
            <FormField
              label="Project Name"
              type="text"
              placeholder="Project Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />

            <FormField
              label="Description"
              type="textarea"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows="3"
              required
            />

            <FormField
              label="Deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => handleInputChange("deadline", e.target.value)}
              required
              min={formData.startDate || new Date().toISOString().split("T")[0]}
            />

            <FormField
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              required
              min={new Date().toISOString().split("T")[0]}
            />

            <FormField
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
              required
              min={formData.startDate || new Date().toISOString().split("T")[0]}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Members (Optional)
              </label>
              <select
                multiple
                value={formData.members}
                onChange={(e) => {
                  const selectedMembers = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  handleInputChange("members", selectedMembers);
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
              <p className="text-xs text-gray-500">
                Selected: {formData.members.length} members
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCreateProject}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FormField = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  rows,
  required,
  min,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {type === "textarea" ? (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required={required}
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required={required}
        min={min}
      />
    )}
  </div>
);

export default CreateProjectModal;
