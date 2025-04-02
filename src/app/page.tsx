import { getEmoteLog, syncFromChatLog } from './utils'
import BarChart from './BarChart'
import Dashboard from './Dashboard';

export default async function Home() {
  await syncFromChatLog();
  const emoteLog = await getEmoteLog();

  return (
    <Dashboard emoteLog={emoteLog} />
  )
}
