"use client";
import React from "react";


interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePreviousClick = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="join w-[12rem] border border-black flex justify-center items-center gap-4 rounded-md p-2">
      <button onClick={handlePreviousClick} className="join-item  bg-white">
        «
      </button>
      <span className="join-item">
        {" "}
        Page {currentPage} of {totalPages}{" "}
      </span>
      <button onClick={handleNextClick} className="join-item  bg-white">
        » 
      </button>
    </div>
  );
};

export default Pagination;
