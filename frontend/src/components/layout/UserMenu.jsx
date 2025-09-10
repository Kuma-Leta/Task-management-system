import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserMenu = ({ user, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("authToken");
      toast.success("You have been logged out successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FaUserCircle size={24} className="text-gray-600" />
        <div className="text-left hidden md:block">
          <p className="text-sm font-medium text-gray-800">{user?.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200 py-1">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Profile
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
