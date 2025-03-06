import { Announcement } from "../types/announcement";
import { supabase } from "../lib/supabase";
import Feed from "../components/feed/Feed";

interface Channel {
  id: string;
  name: string;
  profile_image_url: string | null;
}

async function getInitialAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Supabase Error (Announcements):", error);
    return [];
  }
  return data || [];
}

async function getChannels(): Promise<Channel[]> {
  const { data, error } = await supabase.from("channels").select("*");

  if (error) {
    console.error("Supabase Error (Channels):", error);
    return [];
  }
  return data || [];
}

async function fetchSubscriptions(): Promise<string[]> {
  return [];
}

export default async function Home() {
  const initialAnnouncements = await getInitialAnnouncements();
  const channels = await getChannels();
  const subscribedChannelIds = await fetchSubscriptions();

  const filteredInitialAnnouncements =
    subscribedChannelIds.length > 0
      ? initialAnnouncements.filter((ann) =>
          subscribedChannelIds.includes(ann.source_channel_id || "")
        )
      : initialAnnouncements;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <main className="flex-grow container mx-auto max-w-7xl px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Info Picker Feed
        </h1>
        <Feed
          initialAnnouncements={filteredInitialAnnouncements}
          channels={channels}
        />
      </main>
    </div>
  );
}
