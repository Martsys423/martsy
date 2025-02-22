"use client";

import Link from "next/link";

export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-red-600">
          Authentication Error
        </h2>
        <p className="text-gray-600">
          There was a problem signing you in. Please try again.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
} 