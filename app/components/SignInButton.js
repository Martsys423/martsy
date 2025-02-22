"use client";

import { signIn } from "next-auth/react";

export default function SignInButton() {
  const handleSignIn = () => {
    signIn("google", {
      callbackUrl: "/dashboards",
      prompt: "select_account"
    });
  };

  return (
    <button
      onClick={handleSignIn}
      className="inline-block px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
    >
      Sign in to Manage API Keys →
    </button>
  );
} 