"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import {
  HoveredLink,
  Menu,
  MenuItem,
  ProductItem,
} from "@/components/ui/navbar-menu";
import { cn } from "@/utils/cn";
import Link from "next/link";

const Header = ({ className }: { className?: string }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setIsSignedIn(true);
        const { data: userData, error } = await supabase
          .from("users")
          .select("profile_picture_url")
          .eq("id", session.user.id)
          .single();

        if (userData) {
          setProfilePic(userData.profile_picture_url || "/default-profile.png");
        } else {
          console.error(error.message);
        }
      } else {
        setIsSignedIn(false);
      }
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      // Clear the access token from local storage
      localStorage.removeItem("access_token");
      setIsSignedIn(false);
      setProfilePic(null);
      router.push("/");
    } else {
      console.error(error.message);
    }
  };

  return (
    <div className="navbar bg-white flex text-black">
      <div
        className={cn(
          "fixed top-10 inset-x-0 max-w-xl mx-auto z-50",
          className
        )}
      >
        <Menu setActive={setActive}>
          <Link href="/" className="text-black">
            Home
          </Link>
          {isSignedIn ? (
            <>
              <Link href="/projects" className="text-black">
                Projects
              </Link>
              <Link href="/profile" className="text-black">
                Profile
              </Link>
              <p className="cursor-pointer text-black" onClick={handleLogout}>
                Logout
              </p>
            </>
          ) : (
            <>
              <Link href="/api/auth/signin" className="text-black">
                Sign In
              </Link>
              <Link href="/api/auth/signup" className="text-black">
                Sign Up
              </Link>
            </>
          )}
        </Menu>
      </div>
    </div>
  );
};

export default Header;
