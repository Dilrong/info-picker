"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function Header() {
  return (
    <Card className="w-full sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto max-w-7xl flex justify-between items-center px-4 py-2">
        <Link href="/" className="flex items-center space-x-2 group">
          <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors duration-200">
            Info Picker
          </span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
          >
            Feed
          </Link>
          <Link
            href="/request"
            className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
          >
            Request Channel
          </Link>
        </nav>
      </div>
    </Card>
  );
}
