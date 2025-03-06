"use client";

import { Announcement, Channel } from "../../types/announcement";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FeedItemProps {
  item: Announcement;
  channels: Channel[];
}

export default function FeedItem({ item, channels }: FeedItemProps) {
  const getChannelInfo = (channelId: string | null) => {
    const channel = channels.find((ch) => ch.id === channelId);
    return channel || { name: "Unknown", profile_image_url: null };
  };

  const { name, profile_image_url } = getChannelInfo(item.source_channel_id);

  const handleShare = async () => {
    const shareData = {
      title: `${name}의 새로운 소식`,
      text: item.summary || "지금 확인하기",
      url: window.location.href, // 현재 페이지 URL (필요 시 공지별 고유 URL 생성)
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast("Shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Web Share API 미지원 시 클립보드 복사
      navigator.clipboard.writeText(
        `${shareData.title}\n${shareData.text}\n${shareData.url}`
      );
      toast("Link copied to clipboard!");
    }
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200 relative">
      <CardContent className="px-4 py-4 space-y-4">
        {/* Summary */}
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Summary
          </h3>
          <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
            {item.summary || "Not available"}
          </p>
        </div>

        {/* Translated */}
        <div className="space-y-1 border-t border-gray-200 dark:border-gray-700 pt-3">
          <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Translated
          </h3>
          <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
            {item.translated_content || "Not available"}
          </p>
        </div>

        {/* Original (Collapsible) */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem
            value="original"
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide py-2 hover:text-blue-500 dark:hover:text-blue-400">
              Original
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                {item.original_content}
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Channel Info & Timestamp */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
          {profile_image_url ? (
            <Image
              src={profile_image_url}
              alt={`${name} profile`}
              width={20}
              height={20}
              className="rounded-full"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-700" />
          )}
          <span>{name}</span>
          <span>•</span>
          <span>{new Date(item.timestamp).toLocaleString()}</span>
        </div>
      </CardContent>

      {/* Share Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="absolute top-2 right-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
      </Button>
    </Card>
  );
}
