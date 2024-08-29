"use client";

import { Hero } from "@/components/Hero";
import data from "../data/fund.json"

function getData(){
  const response = data
  return response
}


export default function Home() {

  const result  = getData()

  // console.log(result);
  

  return (
    <>
      <Hero />
     
    </>
  );
}
