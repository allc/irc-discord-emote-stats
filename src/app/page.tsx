import { getEmoteLog, syncFromChatLog } from './utils'
import Dashboard from './Dashboard';

export const dynamic = 'force-dynamic'

export default async function Home() {
  await syncFromChatLog();
  const emoteLog = await getEmoteLog();

  return (
    <Dashboard emoteLog={emoteLog} />
  )
}
