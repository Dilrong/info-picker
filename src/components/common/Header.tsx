"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Header() {
  return (
    <Card className="w-full sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto max-w-5xl flex justify-between items-center px-4">
        <Link href="/" className="flex items-center space-x-2 group">
          <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors duration-200">
            Info Picker
          </span>
        </Link>
      </div>
    </Card>
  );
}
