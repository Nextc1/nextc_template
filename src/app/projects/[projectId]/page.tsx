"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Timer from "@/components/Timer";
import Loading from "@/components/Loader";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../components/ui/carousel";
import { supabase } from "../../../utils/supabase";

interface TimerData {
  start_date: string;
  end_date: string;
}

interface ProjectData {
  id: string;
  project_image: any;
  project_name: string;
  company_name: string;
  location: string;
  status: string;
  carbon_credits: number;
  amount_for_raise: number;
  emission_reduction: string;
  timer: TimerData[];
}

function ProjectId() {
  const params = useParams();
  const { projectId } = params;
  const [projectData, setProjectData] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      let { data, error }: any = await supabase
        .from("project_data")
        .select("*")
        .eq("id", projectId);
      if (error) {
        console.error("Error fetching event details:", error);
      } else {
        setProjectData(data);
      }
      setIsLoading(false);
    }
    if (projectId) {
      getData();
    }
  }, []);

  if (isLoading) {
    return <Loading />; // Display loading indicator if data is loading
  }

  return (
    <>
      <div className="w-full bg-white text-black py-[6rem] px-[2rem]">
        {projectData.map((project: ProjectData) => (
          <div className="flex flex-row p-10" key={project.id}>
            <div className="w-[60%] p-10">
              <Carousel>
                <CarouselContent>
                  {project.project_image.map((item: any) => (
                    <CarouselItem>
                      <img src={item.url} className="rounded-lg" />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
            <div className="p-10 rounded-md flex flex-col gap-4">
              <h1 className="text-3xl font-bold">{project.project_name}</h1>
              <p>Company Name: {project.company_name}</p>
              <p>Location: {project.location}</p>
              <p>Carbon Credits: {project.carbon_credits}</p>
              <p>Amount Raised: ${project.amount_for_raise}</p>
              <p>Emission Reduction: {project.emission_reduction}</p>
              <p className="flex gap-2">
                Time Left:{" "}
                {project.timer.map((data, index) => (
                  <Timer
                    key={index}
                    startDate={data.start_date}
                    endDate={data.end_date}
                    isLoading={isLoading}
                  />
                ))}
              </p>
              <div className="bg-green-600 text-white rounded-md text-center w-[5rem] p-2 text-xs font-medium">
                {project.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ProjectId;
