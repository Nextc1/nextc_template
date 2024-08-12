"use client";
import { useState, useEffect } from "react";
import Pagination from "@/components/Pagination";
import data from "../../data/fund.json";
import Link from "next/link";
// import { HiCreditCard } from "react-icons/hi2";
// import { FaLocationDot } from "react-icons/fa6";

interface Project {
  id: string;
  project_name: string;
  project_image: string;
  carbon_credits: number;
  emission_reduction: number;
  amount_for_raise: number;
  company_name: string;
  location: string;
  timer: {
    start_date: string;
    end_date: string;
    ended: boolean;
  };
  status: string;
}

function getData() {
  const response = data;
  return response;
}

const Projects: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");

  const projectData = getData().filter((project) => {
    return (
      (selectedStatus === "all" || project.status === selectedStatus) &&
      project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = projectData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(projectData.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1);
    }
  }, [totalPages, currentPage]);

  return (
    <>
      <div className="w-full h-full bg-white text-black py-[5rem] px-[2rem]">
        <div className="text-center my-10 text-4xl font-bold">
          Explore Projects
        </div>
        <div className="w-full my-[3rem] flex flex-row gap-4 justify-end">
          <label className="input input-bordered flex items-center gap-2 bg-white border border-black w-full">
            <input
              type="text"
              className="text-black grow w-full"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70 text-white"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
          <select
            className="w-[8rem] bg-white text-start text-black border border-black outline-black rounded-md"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="w-full flex flex-wrap gap-5 justify-evenly">
          {currentItems.length > 0 ? (
            currentItems.map((project) => (
              <Link
                href={`/projects/${project.id}`}
                className="w-[350px] group relative block overflow-hidden rounded-lg shadow-lg transition duration-500 hover:shadow-xl text-black border border-black my-5"
                key={project.id}
              >
                <img
                  src={project.project_image}
                  alt={project.project_name}
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
                />

                <div className="relative bg-white p-6 text-black">
                  <span className="whitespace-nowrap bg-green-600 text-white rounded-md px-3 py-1.5 text-xs font-medium">
                    {project.status}
                  </span>

                  <h3 className="mt-4 text-lg font-medium">
                    {project.project_name}
                  </h3>

                  <p className="mt-1.5 text-sm">$ {project.amount_for_raise}</p>

                  <div className="card-actions justify-end">
                    <div className="badge badge-outline flex gap-2">
                      {/* <HiCreditCard /> */}
                      {project.carbon_credits}
                    </div>
                    <div className="badge badge-outline flex gap-2">
                      {/* <FaLocationDot /> */}
                      {project.location}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="h-screen flex flex-col justify-center items-center text-3xl font-bold">
              Project Not Found
            </div>
          )}
        </div>
        <div className="text-center mt-[3rem]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </>
  );
};

export default Projects;
