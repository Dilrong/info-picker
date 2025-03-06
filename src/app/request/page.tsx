"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChannelRequest {
  id: number;
  channel_url: string;
  channel_name: string;
  channel_id: string | null;
  status: "pending" | "approved" | "rejected";
}

export default function ChannelRequestPage() {
  const [channelName, setChannelName] = useState("");
  const [channelUrl, setChannelUrl] = useState("");
  const [requests, setRequests] = useState<ChannelRequest[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function fetchRequests() {
    const { data } = await supabase
      .from("channel_requests")
      .select("*")
      .order("created_at", { ascending: false });
    setRequests(data || []);
    console.log(requests);
    updateChartData(data || []);
  }

  async function updateChartData(requests: ChannelRequest[]) {
    const nameCount: { [key: string]: number } = {};
    requests.forEach((req) => {
      nameCount[req.channel_name] = (nameCount[req.channel_name] || 0) + 1;
    });

    const colors = [
      "var(--chart-1)",
      "var(--chart-2)",
      "var(--chart-3)",
      "var(--chart-4)",
      "var(--chart-5)",
    ];

    console.log(colors[0]);

    const formattedData = Object.entries(nameCount).map(
      ([channel_name, count], index) => ({
        channel: channel_name, // 프로젝트 이름으로 정확히 설정
        requests: count,
        fill: colors[index % colors.length],
      })
    );

    setChartData(formattedData);
  }

  const chartConfig: ChartConfig = {
    requests: {
      label: "Requests",
    },
    ...Object.fromEntries(
      chartData.map((item) => [
        item.channel.toLowerCase().replace(/\s+/g, ""),
        {
          label: item.channel,
          color: item.fill,
        },
      ])
    ),
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from("channel_requests").insert({
      channel_name: channelName,
      channel_url: channelUrl,
    });

    if (error) {
      toast.error("Error submitting request", { description: error.message });
    } else {
      toast.success("Channel requested!", {
        description: `${channelName} added to Info Picker.`,
      });
      setChannelName("");
      setChannelUrl("");
      fetchRequests();
    }
  }

  const renderCustomizedLabel = ({ channel }: { channel: string }) => {
    return channel;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Info Picker Channel Requests
        </h1>

        {/* Pie Chart 상단 배치 */}
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Channel Request Stats</CardTitle>
            <CardDescription>Total channel requests submitted</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={chartData}
                  dataKey="requests"
                  nameKey="channel" // channel 속성 사용
                  label={renderCustomizedLabel} // channel 이름 표시
                  labelLine={true}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending channels <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total channel requests to date
            </div>
          </CardFooter>
        </Card>

        {/* 요청 폼 */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white dark:bg-gray-950 p-6 rounded-lg shadow-md"
        >
          <Input
            placeholder="Channel Name (e.g., Hyperliquid)"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            required
          />
          <Input
            placeholder="Discord Channel URL (e.g., https://discord.com/channels/123/456)"
            value={channelUrl}
            onChange={(e) => setChannelUrl(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Request Channel
          </Button>
        </form>
      </div>
    </div>
  );
}
