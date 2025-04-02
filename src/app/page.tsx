import { getEmoteLog, syncFromChatLog } from './utils'
import Dashboard from './Dashboard';

export default async function Home() {
  await syncFromChatLog();
  const emoteLog = await getEmoteLog();

  return (
    <Dashboard emoteLog={emoteLog} />
  )
}
