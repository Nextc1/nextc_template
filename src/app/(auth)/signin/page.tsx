"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../utils/supabase";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IconBrandGoogle } from "@tabler/icons-react";
import Loading from "../../../components/Loader";
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        router.push("/");
      }
    };
    checkUser();
  }, [router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        // Wait for a moment to ensure the sign-in process completes
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Use router.replace to refresh the home page
        router.replace("/");
        window.location.reload();
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) {
        setError(error.message);
      } else {
        // Wait for a moment to ensure the sign-in process completes
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Use router.replace to refresh the home page
        router.replace("/");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: "http://localhost:3000/api/auth/update-password", // Update this URL to your password update page
      });

      if (error) {
        setError(error.message);
      } else {
        setError("Password reset email sent. Please check your inbox.");
        setResetPassword(false); // Redirect back to sign in form
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-white p-8">
          <div className="w-full max-w-md p-8 bg-white text-black rounded-lg shadow-md border border-black">
            <h2 className="text-2xl font-bold mb-6">Sign In</h2>
            {error && <div className="mb-4 text-red-500">{error}</div>}

            {!resetPassword ? (
              <>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-black">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-black">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-black text-white p-2 rounded-md"
                  >
                    Sign In
                  </button>
                </form>
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full mt-4 text-black border border-black p-2 rounded-md"
                >
                  <IconBrandGoogle className="h-5 w-5 inline mr-2" />
                  Sign In with Google
                </button>
                <div className="mt-4 text-center">
                  <p className="text-gray-600">
                    Don't have an account?{" "}
                    <Link
                      href="/api/auth/signup"
                      className="text-black hover:underline ml-2"
                    >
                      Sign Up
                    </Link>
                  </p>
                  <p
                    onClick={() => setResetPassword(true)}
                    className="text-black hover:underline mt-2"
                  >
                    Forgot Password?
                  </p>
                </div>
              </>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <Label htmlFor="reset-email">Email Address</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="example@domain.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="w-full">
                  Send Password Reset Email
                </button>
                <button
                  onClick={() => setResetPassword(false)}
                  className="w-full mt-4 text-blue-500 font-medium hover:underline"
                >
                  Back to Sign In
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}