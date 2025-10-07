"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader"; // import your custom loader

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/"); // or "/dashboard"
    }
  }, [status, router]);

  // Show Loader while checking session
  if (status === "loading") return <Loader />;

  const handleLogin = async () => {
    setIsSigningIn(true);
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 overflow-hidden">
      {/* Background illustration */}
      <div className="relative z-10 p-10 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col items-center space-y-6 max-w-md w-full">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center">
          Login
        </h1>
        <p className="text-gray-600 text-center">
          Access your dashboard securely with your Google account
        </p>

        <button
          onClick={handleLogin}
          disabled={isSigningIn}
          className={`flex items-center justify-center gap-3 px-6 py-3 rounded-xl shadow-lg transform transition-transform ${
            isSigningIn
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-pink-700 hover:scale-105"
          } text-white font-semibold`}
        >
          {isSigningIn ? (
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Signing in...
            </span>
          ) : (
            <>
              <img
                src="/icons8-google-logo-48.png"
                alt="Google Logo"
                className="w-6 h-6"
              />
              Login with Google
            </>
          )}
        </button>

        <p className="text-sm text-gray-500">
          By logging in, you agree to our{" "}
          <a href="#" className="underline hover:text-blue-700">
            Terms & Conditions
          </a>
        </p>
      </div>

      {/* Animated floating shapes */}
      <div className="absolute top-10 left-20 w-10 h-10 bg-purple-300 rounded-full opacity-40 animate-bounce-slow"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-blue-300 rounded-full opacity-30 animate-bounce-slow"></div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
