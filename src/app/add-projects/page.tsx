"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../utils/supabase";
import { useRef, ChangeEvent, useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddProject() {
  const [user, setUser]: any = useState(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (project_data: any) => {
    console.log(project_data);
    const { data, error } = await supabase
      .from("project_data")
      .insert([
        {
          project_name: project_data.project_name,
          carbon_credits: project_data.carbon_credits,
          emission_reduction: project_data.emission_reduction,
          amount_for_raise: project_data.amount_for_raise,
          company_name: project_data.company_name,
          location: project_data.location,
          status: project_data.status,
        },
      ])
      .select();

    if (error) {
      console.error(error);
      return;
    }

    if (data.length === 0) {
      console.error("No data returned from the insert operation.");
      return;
    }
  };

  return (
    <div className="absolute top-0 w-full h-auto bg-white text-black py-[8rem] px-[2rem] flex flex-col justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col flex-wrap gap-10 md:w-2/3"
      >
        <h1 className="text-2xl md:text-4xl font-extrabold text-center">
          Add Projects
        </h1>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="project_name">Project Name: </label>
          <input
            type="text"
            placeholder="Enter Project Name"
            {...register("project_name", {
              required: true,
              max: 999,
              min: 39,
            })}
            className="w-full border border-black p-2 rounded-md bg-white text-black"
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <label htmlFor="carbon_credits">Carbon Credit: </label>
          <input
            type="number"
            placeholder="Enter Carbon Credit"
            {...register("carbon_credits", {
              required: true,
            })}
            className="w-full border border-black p-2 rounded-md bg-white text-black"
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <label htmlFor="emission_reduction">Emission Reduction: </label>
          <input
            type="number"
            placeholder="Enter Emission Reduction"
            {...register("emission_reduction", {
              required: true,
            })}
            className="w-full border border-black p-2 rounded-md bg-white text-black"
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <label htmlFor="amount_for_raise">Amount For Raise: </label>
          <input
            type="number"
            placeholder="Enter Amount For Raise"
            {...register("amount_for_raise", { required: true })}
            className="w-full border border-black p-2 rounded-md bg-white text-black"
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <label htmlFor="company_name">Company Name: </label>
          <input
            type="text"
            placeholder="Enter Company Name"
            {...register("company_name", { required: true })}
            className="w-full border border-black p-2 rounded-md bg-white text-black"
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <label htmlFor="location">Location: </label>
          <input
            type="text"
            placeholder="Enter Location"
            {...register("location", { required: true })}
            className="w-full border border-black p-2 rounded-md bg-white text-black"
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <label htmlFor="status">Project Status: </label>
          <select
            {...register("status", { required: true })}
            className="w-full border border-black p-2 rounded-md bg-white text-black"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="done">Done</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full border border-black p-2 rounded-md bg-white text-blac
           hover:bg-black hover:text-white"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
