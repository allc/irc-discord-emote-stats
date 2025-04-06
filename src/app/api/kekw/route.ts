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

  // filter by channels
  const channelsParams = searchParams.get("channels");
  if (channelsParams) {
    const channels = channelsParams.split(",");
    filteredEmoteLog = filteredEmoteLog.filter((entry) => {
      return channels.includes(entry.channel);
    });
  }

  // count by day
  const actions = ["message", "reaction"];
  const countsByDate: { [key: string]: { actions: { [key: string]: number } } } = {};
  filteredEmoteLog.forEach((entry) => {
    const date = new Date(Number(entry.timestamp)).toISOString().split("T")[0];
    if (!countsByDate[date]) {
      const countsByAction = actions.reduce((acc: any, action) => {
        acc[action] = 0;
        return acc;
      }, {});
      countsByDate[date] = { actions: countsByAction };
    }
    countsByDate[date].actions[entry.action]++;
  });

  const countsByDateArray = Object.entries(countsByDate).map(([date, counts]) => {
    return {
      date,
      ...counts,
    };
  });
  countsByDateArray.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const countsByDateWithCumulative: any = [];
  countsByDateArray.forEach((entry, index) => {
    const counts = entry.actions;
    const cumulativeCounts = Object.entries(counts).reduce((acc: any, [action, count]) => {
      acc[action] = count;
      if (index > 0) {
        acc[action] += countsByDateWithCumulative[index - 1].actionsCumulative[action];
      }
      return acc;
    }, {});
    countsByDateWithCumulative.push({
      ...entry,
      actionsCumulative: cumulativeCounts,
    });
  });

  return new Response(JSON.stringify(countsByDateWithCumulative), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
