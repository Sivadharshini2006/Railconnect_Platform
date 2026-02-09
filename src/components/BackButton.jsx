import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const BackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-gray-600 font-medium text-base py-2 px-3 rounded-md transition-all duration-200 hover:bg-gray-100 hover:text-blue-600 hover:-translate-x-1 mb-4"
    >
      <FaArrowLeft className="text-sm" />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;