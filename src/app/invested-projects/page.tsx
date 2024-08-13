"use client";
import data from "../../data/invested.json";
import Link from "next/link";
import { HiCreditCard } from "react-icons/hi2";
import { FaLocationDot } from "react-icons/fa6";

function getData() {
  const response = data;
  return response;
}

function page() {
  const projectData = getData();
  // console.log(projectData);
  return (
    <>
      <div className="w-full bg-black text-white py-[5rem] px-[2rem]">
        <div className="text-center my-10 text-4xl font-bold">
          Project Invested
        </div>
        <div className="w-full flex flex-wrap gap-5 justify-evenly">
          {data.map((project) => (
            <Link
              href={`/project-invested/${project.id}`}
              className="w-[350px] group relative overflow-hidden rounded-lg shadow-lg transition duration-500 hover:shadow-xl text-white border border-white my-5 block"
              key={project.id}
            >
              <img
                src={project.project_image}
                alt={project.project_name}
                className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
              />

              <div className="relative bg-black p-6 text-white flex flex-col gap-4">
                <h3 className="mt-4 text-lg font-medium">
                  {project.project_name}
                </h3>
                <div className="card-actions justify-end">
                  <div className="badge badge-outline flex gap-2">
                    <HiCreditCard />
                    {project.carbon_credits}
                  </div>
                  <div className="badge badge-outline flex gap-2">
                    <FaLocationDot />
                    {project.location}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default page;
