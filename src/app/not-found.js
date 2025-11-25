"use client";

import Image from "next/image";
import Link from "next/link";

export default function PageNotFound() {
  return (
    <div className="px-4 py-12 flex flex-col items-center justify-center">
      <Image
        src="/images/page-not-found.png"
        alt="Page Not Found"
        height={256}
        width={256}
        priority
        className="mb-6"
      />
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
        Oops! Page not found
      </h1>
      <p className="text-gray-600 text-center max-w-md mb-6">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link
        href="/"
        className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
