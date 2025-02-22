"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function LoginButton() {
  const { data: session } = useSession();

  const handleSignIn = () => {
    signIn("google", {
      prompt: "select_account"
    });
  };

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-700">
          Hello, {session.user.name}
        </p>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <Image
        src="/google.svg"
        alt="Google Logo"
        width={20}
        height={20}
      />
      Sign in with Google
    </button>
  );
} 