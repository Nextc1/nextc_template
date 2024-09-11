"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../utils/supabase";
import { useRef, ChangeEvent, useState, useTransition, useEffect } from "react";
import { convertBlobUrlToFile } from "../../action/convertBlobUrlToFile";
import { uploadImage } from "../../action/uploadSupabase";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AddProject() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isError, setIsError] = useState("");
  const [isPending, startTransition] = useTransition();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      if (file) {
        const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSizeInBytes) {
          setIsError("File size should be less than 2MB.");
          e.target.value = "";
          return;
        }

        const newImageUrls = [URL.createObjectURL(file)];

        setImageUrls(newImageUrls);
      }
    }
  };

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

    startTransition(async () => {
      let urls = [];
      for (const url of imageUrls) {
        const imageFile = await convertBlobUrlToFile(url);

        const { imageUrl, error } = await uploadImage({
          file: imageFile,
          bucket: "project_image",
        });

        if (error) {
          console.error(error);
          return;
        }

        urls.push(imageUrl);
        // console.log(imageUrl);
      }
      const { data: imageData, error: imageError }: any = await supabase
        .from("project_images")
        .insert([
          {
            project_id: data[0].id,
            url: urls,
          },
        ])
        .select();
      setImageUrls([]);
    });
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

        <div className="w-full flex flex-col gap-2">
          <label htmlFor="event_image">Project Images: </label>
          <input
            id="project_image"
            type="file"
            accept="image/jpeg, image/png"
            multiple={true}
            ref={imageInputRef}
            onChange={(e) => handleImageChange(e)}
            disabled={isPending}
            className="w-full border border-black p-2 rounded-md bg-white text-black"
          />
          <p className="text-red-500">{isError}</p>
        </div>

        <div className="w-full flex flex-wrap justify-start items-center gap-4">
          {imageUrls.length > 0 ? (
            <>
              {imageUrls.map((url, index) => (
                <Image
                  width={100}
                  height={100}
                  key={url}
                  src={url}
                  alt={`img-${index}`}
                  className="w-auto h-auto border border-white rounded-lg object-contain"
                />
              ))}
            </>
          ) : (
            <h1>Image Preview Here...</h1>
          )}
        </div>

        <button
          type="submit"
          className="w-full border border-black p-2 rounded-md bg-white text-black hover:bg-black hover:text-white"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
