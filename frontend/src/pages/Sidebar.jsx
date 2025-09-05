import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useProject } from "../contexts/ProjectContext";
import { FaBars, FaTimes } from "react-icons/fa";

// Color constants
const PRIMARY_COLOR = "#801A1A";
const SECONDARY_COLOR = "#F6C026";
const DARK_BG = "#2D3748";
const LIGHT_TEXT = "#F7FAFC";
const HOVER_BG = "#631414";

const Sidebar = ({ userRole }) => {
  const { selectedProject } = useProject();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // mobile toggle
  const [isCollapsed, setIsCollapsed] = useState(false); // desktop toggle

  const menuItems = [
    { path: "/todos", label: "To-Dos" },
    { path: "/completed", label: "Completed" },
    { path: "/tasks", label: "Tasks" },
    { path: "/in-progress", label: "In Progress" },
  ];

  if (userRole === "manager") {
    menuItems.push({ path: "/team", label: "Team Management" });
    menuItems.unshift({ path: "/dashboard", label: "Dashboard" });
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-3 z-50 p-2 rounded-lg md:hidden"
        style={{
          backgroundColor: PRIMARY_COLOR,
          color: LIGHT_TEXT,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        }}
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 transform transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:relative md:top-0 h-screen flex flex-col z-40 
          ${isCollapsed ? "w-20" : "w-64"}`}
        style={{ backgroundColor: DARK_BG }}
      >
        {/* Sidebar Header */}
        <div
          className="p-4 border-b flex items-center justify-between"
          style={{ borderColor: PRIMARY_COLOR }}
        >
          {!isCollapsed && (
            <h2
              className="text-lg font-semibold truncate"
              style={{ color: SECONDARY_COLOR }}
              title={selectedProject?.name}
            >
              {selectedProject?.name || "Select Project"}
            </h2>
          )}

          {/* Collapse/Expand Button for Desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:block p-2 rounded-lg"
            style={{
              backgroundColor: PRIMARY_COLOR,
              color: LIGHT_TEXT,
            }}
          >
            {isCollapsed ? <FaBars size={18} /> : <FaTimes size={18} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col p-4 gap-2 flex-grow">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg transition-all duration-200 font-medium flex items-center gap-2 ${
                  isActive ? "shadow-md" : "hover:shadow-md"
                }`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? PRIMARY_COLOR : "transparent",
                color: isActive ? LIGHT_TEXT : SECONDARY_COLOR,
                border: isActive ? "none" : `1px solid ${PRIMARY_COLOR}`,
              })}
              onClick={() => setIsSidebarOpen(false)}
            >
              {/* Show only label if expanded */}
              {!isCollapsed && item.label}
              {/* If collapsed, show initials */}
              {isCollapsed && item.label[0]}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        {!isCollapsed && (
          <div
            className="p-4 mt-auto text-xs text-center"
            style={{ color: SECONDARY_COLOR, opacity: 0.7 }}
          >
            EagleLion Task Manager
          </div>
        )}
      </div>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
