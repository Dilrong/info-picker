import { Client, GatewayIntentBits } from "discord.js";
import axios from "axios";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// ENV
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const AI_MODEL = "google/gemini-flash-1.5-8b";

interface Channel {
  id: string;
  name: string;
  profile_image_url: string | null;
}

let targetChannelIds: string[] = [];

async function fetchTargetChannels() {
  try {
    const response = await axios.get(`${SUPABASE_URL}/rest/v1/channels`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
    });

    targetChannelIds = response.data.map((channel: Channel) => channel.id);
    console.log("Target Channel IDs:", targetChannelIds);
  } catch (error) {
    console.error("Error fetching channels from Supabase:", error);
  }
}

/**
 * 요약 및 번역
 * @param content
 * @returns
 */
async function summarizeAndTranslate(content: string) {
  const headers = {
    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
  };

  const summaryResponse = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: AI_MODEL,
      messages: [
        {
          role: "user",
          content: `${content} \n Can you give us a one-sentence summary of the key points in Korean?`,
        },
      ],
    },
    { headers }
  );
  const summary = summaryResponse.data.choices[0].message.content;

  const translateResponse = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: AI_MODEL,
      messages: [{ role: "user", content: `Translate to Korean: ${content}` }],
    },
    { headers }
  );
  const translatedContent = translateResponse.data.choices[0].message.content;

  return { summary, translatedContent };
}

/**
 * 채널 메시지 생성
 * @param message
 * @returns
 */
client.on("messageCreate", async (message) => {
  if (targetChannelIds.includes(message.channel.id)) {
    const originalContent = message.content;
    console.log(`Message from ${message.channel.id}: ${originalContent}`);

    const { summary, translatedContent } = await summarizeAndTranslate(
      originalContent
    );

    const response = await axios.post(
      `${SUPABASE_URL}/rest/v1/announcements`,
      {
        original_content: originalContent,
        summary,
        translated_content: translatedContent,
        source_channel_id: message.channel.id,
        timestamp: message.createdAt.toISOString(),
      },
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 201) {
      console.log(`Saved: ${originalContent}`);
    } else {
      console.error("Supabase Error:", response.data);
    }
  }
});

client.once("ready", async () => {
  console.log(`Ready to Bot: ${client.user?.tag}`);
  await fetchTargetChannels();
});

client.login(DISCORD_BOT_TOKEN);
