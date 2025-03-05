"use client";

import { Card } from "@/components/ui/card";

export default function Footer() {
  return (
    <Card className="w-full py-4 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-xs flex flex-col gap-2 justify-center items-center">
      <span>© 2025 Dilrong. All rights reserved.</span>
      <div className="flex gap-4">
        <a
          href="https://github.com/Dilrong"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
        >
          Github
        </a>
        <a
          href="https://twitter.com/dilrong_"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
        >
          Twitter
        </a>
      </div>
    </Card>
  );
}
