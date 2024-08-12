"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import data from "../../../data/invested.json";
import Loading from "@/components/Loading";

interface ProjectData {
  id: string;
  project_image: string;
  project_name: string;
  company_name: string;
  location: string;
  company_amount: "string";
  carbon_credits_received: number;
  emission_reduction: string;
  date_time: string;
  carbon_credits: number;
  invested: number;
}

function page() {
  const params = useParams();
  const investedId = params.investedId as string;

  const [projectData, setProjectData] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true); // Start loading
    const response: any = data.filter((item) => item.id === investedId);
    setProjectData(response);
    setIsLoading(false); // End loading
  }, [investedId]);

  if (isLoading) {
    return <Loading />; // Display loading indicator if data is loading
  }

  return (
    <>
      <div className="w-full bg-black text-white py-[6rem] px-[2rem]">
        {projectData.map((project: ProjectData) => (
          <div className="flex flex-row p-10" key={project.id}>
            <div className="w-[60%] p-10">
              <img
                src={project.project_image}
                alt={project.project_name}
                className="w-full rounded-md"
              />
            </div>
            <div className="p-10 rounded-md flex flex-col gap-4">
              <h1 className="text-3xl font-bold">{project.project_name}</h1>
              <p>Company Name: {project.company_name}</p>
              <p>Location: {project.location}</p>
              <p>Carbon Credits: {project.carbon_credits}</p>
              <p>Emission Reduction: {project.emission_reduction}</p>
              <p>Date: {project.date_time}</p>
              <p>Company Amount: {project.company_amount}</p>
              <p>Invested: {project.invested}</p>
              <p>Carbon Credits Received: {project.carbon_credits_received}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default page;
