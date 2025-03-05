"use client";

import { useState } from "react";
import { Announcement, Channel } from "../../types/announcement";
import { supabase } from "../../lib/supabase";
import FeedItem from "./FeedItem";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "../ui/card";

interface FeedProps {
  initialAnnouncements: Announcement[];
  channels: Channel[];
}

export default function Feed({ initialAnnouncements, channels }: FeedProps) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const fetchMoreAnnouncements = async () => {
    const from = page * itemsPerPage;
    const to = from + itemsPerPage - 1;

    let query = supabase
      .from("announcements")
      .select("*")
      .order("timestamp", { ascending: false })
      .range(from, to);

    if (selectedChannel) {
      query = query.eq("source_channel_id", selectedChannel);
    }

    if (searchQuery) {
      query = query.ilike("summary", `%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching more announcements:", error);
      setHasMore(false);
      return;
    }

    if (data && data.length > 0) {
      setAnnouncements((prev) => [...prev, ...data]);
      setPage((prev) => prev + 1);
    } else {
      setHasMore(false);
    }
  };

  const handleChannelChange = async (value: string) => {
    const channelId = value === "all" ? null : value;
    setSelectedChannel(channelId);
    setPage(0);
    setHasMore(true);

    let query = supabase
      .from("announcements")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(itemsPerPage);

    if (channelId) {
      query = query.eq("source_channel_id", channelId);
    }

    if (searchQuery) {
      query = query.ilike("summary", `%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching filtered announcements:", error);
      return;
    }

    setAnnouncements(data || []);
    setPage(1);
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setPage(0);
    setHasMore(true);

    let supabaseQuery = supabase
      .from("announcements")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(itemsPerPage);

    if (selectedChannel) {
      supabaseQuery = supabaseQuery.eq("source_channel_id", selectedChannel);
    }

    if (query) {
      supabaseQuery = supabaseQuery.ilike("summary", `%${query}%`);
    }

    const { data, error } = await supabaseQuery;

    if (error) {
      console.error("Error searching announcements:", error);
      return;
    }

    setAnnouncements(data || []);
    setPage(1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const filteredAnnouncements = announcements.filter((item) => {
    const channel = channels.find((ch) => ch.id === item.source_channel_id);
    const channelName = channel ? channel.name.toLowerCase() : "unknown";
    const searchLower = searchQuery.toLowerCase();

    return (
      (!selectedChannel || item.source_channel_id === selectedChannel) &&
      (!searchQuery ||
        channelName.includes(searchLower) ||
        (item.summary?.toLowerCase() || "").includes(searchLower) ||
        (item.translated_content?.toLowerCase() || "").includes(searchLower) ||
        (item.original_content?.toLowerCase() || "").includes(searchLower))
    );
  });

  return (
    <div className="space-y-4">
      {/* Filter and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Select onValueChange={handleChannelChange} defaultValue="all">
          <SelectTrigger className="w-full sm:w-[200px] border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
            <SelectValue placeholder="Select a channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            {channels.map((channel) => (
              <SelectItem key={channel.id} value={channel.id}>
                {channel.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full sm:w-[300px] border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
          />
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="px-4 py-1 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 text-sm rounded-md"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Feed with Infinite Scroll */}
      <InfiniteScroll
        className="flex flex-col gap-8"
        dataLength={filteredAnnouncements.length}
        next={fetchMoreAnnouncements}
        hasMore={hasMore}
        loader={
          <div className="text-center py-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Loading...
            </p>
          </div>
        }
        endMessage={
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
            No more announcements
          </p>
        }
      >
        {filteredAnnouncements.length === 0 ? (
          <Card className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-950 text-center">
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                No announcements match your search
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAnnouncements.map((item) => (
            <FeedItem key={item.id} item={item} channels={channels} />
          ))
        )}
      </InfiniteScroll>
    </div>
  );
}
