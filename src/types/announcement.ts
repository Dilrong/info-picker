export interface Announcement {
  id: number;
  original_content: string;
  summary: string | null;
  translated_content: string | null;
  source_channel_id: string | null;
  timestamp: string;
  created_at: string;
}

export interface Channel {
  id: string;
  name: string;
  profile_image_url: string | null;
}
