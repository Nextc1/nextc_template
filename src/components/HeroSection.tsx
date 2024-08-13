import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HeroSection() {
  const router = useRouter();

  useEffect(() => {
    const handleUrlWithToken = () => {
      const hash = window.location.hash;
      console.log("URL hash:", hash);

      if (hash) {
        // Extract access_token from hash
        const params = new URLSearchParams(hash.replace("#", ""));
        const accessToken = params.get("access_token");
        //console.log('Access token:', accessToken); // Log token to debug

        if (accessToken) {
          // Store token or use it as needed
          localStorage.setItem("access_token", accessToken);
          router.push("/");
        } else {
          console.warn("Access token not found in URL"); // Log warning if token is not found
        }
      } else {
        console.warn("URL hash is empty"); // Log warning if hash is empty
      }
    };

    handleUrlWithToken();
  }, [router]);

  return (
    <>
      <div className="h-screen bg-white text-black flex flex-col-reverse pt-[40rem] md:pt-0 md:justify-center items-center md:flex-row">
        <div className="w-full md:w-[50%] flex flex-col justify-start p-5 md:p-10 gap-4">
          <h1 className="text-4xl font-bold">Empowering Your Green Future</h1>
          <p className="text-2xl">
            Offset your carbon footprint with verified, impactful projects
          </p>
          <button className="md:w-[20rem]  px-6 py-2 bg-transparent border border-black text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400">
            Explore Projects
          </button>
        </div>
        <div className="w-full md:w-[50%] p-5 md:p-10">
          <Image
            src="/flat-design-carbon-neutral-illustration.png"
            alt="hero-img"
            className="w-full h-full"
            width={500}
            height={500}
          />
        </div>
      </div>
    </>
  );
}
