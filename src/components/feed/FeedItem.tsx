"use client";

import Image from "next/image";
import { Announcement, Channel } from "../../types/announcement";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

  return (
    <Card className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200">
      <CardContent className="px-4 py-4 space-y-4">
        {/* Summary */}
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            요약
          </h3>
          <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
            {item.summary || "Not available"}
          </p>
        </div>

        {/* Translated */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem
            value="original"
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide py-2 hover:text-blue-500 dark:hover:text-blue-400">
              번역
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                {item.translated_content || "Not available"}
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Original (Collapsible) */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem
            value="original"
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide py-2 hover:text-blue-500 dark:hover:text-blue-400">
              원본
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
    </Card>
  );
}
