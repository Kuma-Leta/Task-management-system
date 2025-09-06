import React, { useState, useEffect } from "react";
import axios from "../../axiosConfig";
import { useProject } from "../contexts/ProjectContext";
import {
  FaUsers,
  FaUserPlus,
  FaUserTimes,
  FaSearch,
  FaTrash,
  FaEnvelope,
  FaCrown,
  FaUserCheck,
  FaExclamationTriangle,
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

const TeamManagement = () => {
  const [users, setUsers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedProject } = useProject();

  // Fetch all users and current team members
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all users
        const usersResponse = await axios.get("/api/v1/auth/getUsers");
        setUsers(usersResponse.data.data.users);

        // Fetch team members for the selected project
        if (selectedProject) {
          const teamResponse = await axios.get(
            `/api/v1/project/${selectedProject._id}/team-members`
          );
          setTeamMembers(teamResponse.data.data.members);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedProject]);

  // Handle adding a user to the team
  const handleAddUser = async () => {
    if (!selectedUser) {
      setError("Please select a user to add.");
      return;
    }

    try {
      // Add user to the project
      await axios.post(`/api/v1/project/${selectedProject._id}/add-member`, {
        userId: selectedUser,
      });

      // Refresh the team members list
      const teamResponse = await axios.get(
        `/api/v1/project/${selectedProject._id}/team-members`
      );
      setTeamMembers(teamResponse.data.data.members);

      // Show success message
      const addedUser = users.find((user) => user._id === selectedUser);
      setSuccess(`${addedUser.name} has been added to the team!`);
      setSelectedUser("");
      setError("");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error adding user:", err);
      setError("Failed to add user. Please try again.");
    }
  };

  // Handle removing a user from the team
  const handleRemoveUser = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this team member?")) {
      return;
    }

    try {
      // Remove user from the project
      await axios.post(`/api/v1/project/${selectedProject._id}/remove-member`, {
        userId,
      });

      // Refresh the team members list
      const teamResponse = await axios.get(
        `/api/v1/project/${selectedProject._id}/team-members`
      );
      setTeamMembers(teamResponse.data.data.members);

      // Show success message
      const removedUser = users.find((user) => user._id === userId);
      setSuccess(`${removedUser.name} has been removed from the team.`);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error removing user:", err);
      setError("Failed to remove user. Please try again.");
    }
  };

  // Filter available users based on search term
  const filteredAvailableUsers = users
    .filter((user) => !teamMembers.some((member) => member._id === user._id))
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Filter team members based on search term
  const filteredTeamMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading team data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg bg-blue-100">
              <FaUsers className="text-blue-600 text-2xl" />
            </div>
            <h1
              className="text-3xl font-bold"
              style={{ color: COLORS.primary }}
            >
              Team Management
            </h1>
          </div>
          <p className="text-gray-600">
            Manage your team members for{" "}
            <span className="font-semibold">{selectedProject?.name}</span>
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <FaExclamationTriangle className="mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <FaUserCheck className="mr-2" />
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Team Member Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-blue-100">
                <FaUserPlus className="text-blue-600" />
              </div>
              <h2
                className="text-xl font-semibold"
                style={{ color: COLORS.accent }}
              >
                Add Team Member
              </h2>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Available Users
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select User to Add
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a user...</option>
                {filteredAvailableUsers.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email}) - {user.role}
                  </option>
                ))}
              </select>
            </div>

            {filteredAvailableUsers.length === 0 && searchTerm && (
              <p className="text-gray-500 text-sm mb-4">
                No users found matching your search.
              </p>
            )}

            <button
              onClick={handleAddUser}
              disabled={!selectedUser}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <FaUserPlus className="mr-2" />
              Add to Team
            </button>
          </div>

          {/* Current Team Members Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-green-100">
                <FaUsers className="text-green-600" />
              </div>
              <h2
                className="text-xl font-semibold"
                style={{ color: COLORS.accent }}
              >
                Team Members ({teamMembers.length})
              </h2>
            </div>

            {filteredTeamMembers.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4" style={{ color: COLORS.gray }}>
                  👥
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No team members yet
                </h3>
                <p className="text-gray-500">
                  Add users to build your project team
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredTeamMembers.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-blue-600">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">
                            {member.name}
                          </span>
                          {member.role === "manager" && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center">
                              <FaCrown className="mr-1" size={10} />
                              Manager
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FaEnvelope className="mr-1" size={12} />
                          {member.email}
                        </div>
                      </div>
                    </div>

                    {member.role !== "manager" && (
                      <button
                        onClick={() => handleRemoveUser(member._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove from team"
                      >
                        <FaUserTimes size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {teamMembers.length > 0 &&
              filteredTeamMembers.length === 0 &&
              searchTerm && (
                <p className="text-gray-500 text-sm mt-4 text-center">
                  No team members found matching your search.
                </p>
              )}
          </div>
        </div>

        {/* Statistics Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-8">
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: COLORS.accent }}
          >
            Team Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {teamMembers.length}
              </div>
              <div className="text-sm text-gray-600">Total Members</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {teamMembers.filter((m) => m.role === "manager").length}
              </div>
              <div className="text-sm text-gray-600">Managers</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {teamMembers.filter((m) => m.role === "user").length}
              </div>
              <div className="text-sm text-gray-600">Members</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {users.length - teamMembers.length}
              </div>
              <div className="text-sm text-gray-600">Available Users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
