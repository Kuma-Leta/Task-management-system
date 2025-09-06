import React from "react";

const ProjectSelector = ({
  projects,
  selectedProject,
  selectProject,
  user,
  onOpenModal,
}) => {
  return (
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
          className="bg-[#801A1A] hover:bg-[#6a1515] text-white py-2 px-4 rounded-md font-medium transition-colors"
          onClick={onOpenModal}
        >
          + Create Project
        </button>
      )}
    </div>
  );
};

export default ProjectSelector;
