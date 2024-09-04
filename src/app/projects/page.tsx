"use client";
import { useState, useEffect } from "react";
import Pagination from "../../components/Pagination";
import { supabase } from "../../utils/supabase";
import Link from "next/link";
import Image from "next/image";
import Loading from "../../components/Loader";
import { CiLocationOn } from "react-icons/ci";

interface projectData {
  id: number;
  title: string;
  description: string;
  categories: string[];
  image: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  participants: string[];
  seats: number;
  websiteLink: string;
  price: number;
  status: "active" | "upcoming" | "inactive";
  tags: string[];
}

const Page: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [project, setProject]: any = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function getData() {
      let { data, error }: any = await supabase
        .from("project_data")
        .select("*,project_images(project_id,url)");
      if (error) {
        console.error("Error fetching project details:", error);
      } else {
        setProject(data);
        // console.log(data);
        // console.log(data[0].project_images[0].url);
      }
      setLoading(false);
    }
    getData();
  }, []);

  const projectData = project.filter((project: any) => {
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
          {/* <select
            className="w-[8rem] bg-black text-start text-white border border-white outline-black rounded-md"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="done">Done</option>
          </select> */}
        </div>
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="w-full flex flex-wrap gap-5 justify-evenly">
              {project.length > 0 ? (
                project.map((project: any) => (
                  <Link
                    href={`/explore-projects/${project.id}`}
                    className="w-[350px] group relative block overflow-hidden rounded-lg shadow-lg transition duration-500 hover:shadow-xl text-black border border-black my-5"
                    key={project.id}
                  >
                    <Image
                      width="500"
                      height="500"
                      src={JSON.parse(project.project_images[0]?.url)[0]}
                      alt={project.project_name}
                      className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
                    />

                    <div className="relative bg-white p-6 text-black h-full">
                      <p>{project.project_name}</p>
                      <div className="flex flex-row gap-4">
                        <p>{project.carbon_credits} </p>
                        <p className="flex gap-1">
                          {project.emission_reduction}{" "}
                        </p>
                      </div>
                      <p className="flex gap-1">{project.amount_for_raise}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="h-screen flex flex-col justify-center items-center text-3xl font-bold">
                  project Not Found
                </div>
              )}
            </div>
          </>
        )}

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

export default Page;
