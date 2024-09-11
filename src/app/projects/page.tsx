"use client";
import { useState, useEffect } from "react";
import Pagination from "../../components/Pagination";
import { supabase } from "../../utils/supabase";
import Link from "next/link";
import Image from "next/image";
import Loading from "../../components/Loader";

const Page: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    async function getData() {
      let { data, error }: any = await supabase
        .from("project_data")
        .select("*,project_images(project_id,url),investment_data(*)");
      if (error) {
        console.error("Error fetching project details:", error);
      } else {
        setProjectData(data);
      }
      setLoading(false);
    }
    getData();
  }, []);

  const filteredData = projectData.filter((project: any) => {
    const matchesStatus =
      selectedStatus === "all" || project.status === selectedStatus;
    const matchesSearchTerm =
      project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearchTerm;
  });

  return (
    <>
      <div className="absolute top-0 w-full h-auto bg-white text-black py-[8rem] px-[2rem]">
        <div className="text-center my-10 text-4xl font-bold">
          Explore projects
        </div>
        <div className="w-full my-[3rem] flex flex-row gap-4 justify-end">
          <label className="input input-bordered flex items-center gap-2 bg-white border border-black w-full">
            <input
              type="text"
              className="text-white grow w-full"
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
            <option value="inactive">Inactive</option>
            <option value="done">Done</option>
          </select>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div className="w-full flex flex-wrap gap-5 justify-evenly">
            {filteredData.length > 0 ? (
              filteredData.map((project: any) => (
                <Link
                  href={`/projects/${project.id}`}
                  className="w-[350px] group relative block overflow-hidden rounded-lg shadow-lg transition duration-500 hover:shadow-xl text-black border border-gray-300 my-5"
                  key={project.id}
                >
                  {project.project_images &&
                  project.project_images.length > 0 ? (
                    <Image
                      width="500"
                      height="500"
                      src={JSON.parse(project.project_images[0].url)[0]}
                      alt={project.project_images[0].url}
                      className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
                    />
                  ) : (
                    <div className="h-64 w-full bg-gray-200 flex items-center justify-center">
                      No Image Available
                    </div>
                  )}
                  <div className="relative bg-white p-6 text-black h-full">
                    <h2 className="text-xl font-semibold mb-2">
                      {project.project_name}
                    </h2>
                    <div className="flex flex-row gap-4 mb-2">
                      <p className="text-sm text-gray-600">
                        Carbon Credits: {project.carbon_credits}
                      </p>
                      <p className="text-sm text-gray-600">
                        Emission Reduction: {project.emission_reduction}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Amount Raised: ${project.amount_for_raise}
                    </p>
                    {project.investment_data &&
                    project.investment_data.length > 0 ? (
                      <progress
                        className="progress progress-primary w-full"
                        value={project.investment_data[0].AmountLeft}
                        max={project.investment_data[0].TotalAmountForRaise}
                      ></progress>
                    ) : (
                      <div className="text-sm text-gray-600">
                        No investment data available
                      </div>
                    )}
                    <div
                      className={`w-20 h-6 px-4 mt-2 text-white rounded-full ${
                        project.status === "active"
                          ? "bg-green-700"
                          : "bg-red-700"
                      }`}
                    >
                      {project.status}
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
        )}
      </div>
    </>
  );
};

export default Page;
