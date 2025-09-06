import React, { useState, useEffect, useContext } from "react";
import { useProject } from "../../contexts/ProjectContext";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ProjectSelector from "./ProjectSelector";
import Notifications from "./Notifications";
import UserMenu from "./UserMenu";
import CreateProjectModal from "./CreateProjectModal";
import api_url from "../../utils/constant";

const Topbar = () => {
  const { projects, selectedProject, selectProject, refreshProjects } =
    useProject();
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full top-0 z-50 bg-white border-b border-gray-200 flex justify-between items-center p-4 shadow-sm">
      <ProjectSelector
        projects={projects}
        selectedProject={selectedProject}
        selectProject={selectProject}
        user={user}
        onOpenModal={() => setIsModalOpen(true)}
      />

      <div className="flex items-center gap-4">
        <Notifications />
        <UserMenu user={user} navigate={navigate} />
      </div>

      {isModalOpen && (
        <CreateProjectModal
          onClose={() => setIsModalOpen(false)}
          refreshProjects={refreshProjects}
        />
      )}
    </div>
  );
};

export default Topbar;
