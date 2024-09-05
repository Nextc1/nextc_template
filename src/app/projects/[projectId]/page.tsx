"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loading from "@/components/Loader";
import { supabase } from "../../../utils/supabase";
import Image from "next/image";

function ProjectId() {
  const params = useParams();
  const { projectId } = params;
  const [projectData, setProjectData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      let { data, error }: any = await supabase
        .from("project_data")
        .select("*,project_images(project_id,url),investment_data(*)")
        .eq("id", projectId); // Assuming you want to filter by projectId
      if (error) {
        console.error("Error fetching project details:", error);
      } else {
        setProjectData(data);
      }
      setIsLoading(false);
    }
    getData();
  }, [projectId]);

  if (isLoading) {
    return <Loading />;
  }

  if (!projectData.length || !projectData[0].project_images.length) {
    return <div>No project data or images available.</div>;
  }

  const img = JSON.parse(projectData[0].project_images[0].url);

  return (
    <div className="w-full bg-white text-black py-[6rem] px-[2rem]">
      <div className="flex flex-row p-10">
        <div className="w-[60%] p-10">
          {img.map((i: any) => (
            <div key={i}>
              <Image
                src={i}
                alt="event image"
                className="w-full"
                width={500}
                height={500}
                loading="lazy"
              />
            </div>
          ))}
        </div>
        <div className="p-10 rounded-md flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{projectData[0].project_name}</h1>
          <p>Company Name: {projectData[0].company_name}</p>
          <p>Location: {projectData[0].location}</p>
          <p>Carbon Credits: {projectData[0].carbon_credits}</p>
          <p>Amount Raised: ${projectData[0].amount_for_raise}</p>
          <p>Emission Reduction: {projectData[0].emission_reduction}</p>
          <div className="bg-green-600 text-white rounded-md text-center w-[5rem] p-2 text-xs font-medium">
            {projectData[0].status}
          </div>
          {projectData[0].investment_data &&
          projectData[0].investment_data.length > 0 ? (
            <progress
              className="progress progress-primary w-56"
              value={projectData[0].investment_data[0].AmountLeft}
              max={projectData[0].investment_data[0].TotalAmountForRaise}
            ></progress>
          ) : (
            <div>No investment data available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectId;
