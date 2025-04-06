import { getEmoteLog, syncFromChatLog } from "@/lib/utils";

export async function GET(req: Request) {
  await syncFromChatLog();
  const emoteLog = await getEmoteLog();

  let filteredEmoteLog = emoteLog.filter((entry) => entry.emoji === ":kekw:");

  // filter by start and end time
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  if (from) {
    filteredEmoteLog = filteredEmoteLog.filter((entry) => {
      return Number(entry.timestamp) >= Number(from);
    });
  }
  if (to) {
    filteredEmoteLog = filteredEmoteLog.filter((entry) => {
      return Number(entry.timestamp) <= Number(to);
    });
  }

  const channels = [...new Set(filteredEmoteLog.map((entry) => entry.channel))];

  return new Response(JSON.stringify(channels), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
