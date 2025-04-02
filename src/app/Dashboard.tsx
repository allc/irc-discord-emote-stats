import BarChart from './BarChart'

export default async function Dashboard({ emoteLog }: any) {
  const channels = emoteLog.map((log: any) => log.channel);
  const uniqueChannels = [...new Set(channels)];

  // get emote stats for selected actions
  const actions = ['message', 'reaction'];
  const actionsAttributes: { [action: string]: any } = {
    message: {
      color: 'rgba(255, 99, 132, 0.5)',
    },
    reaction: {
      color: 'rgba(54, 162, 235, 0.5)',
    },
  }
  const actionEmoteLog = actions.reduce((acc: any, action) => {
    acc[action] = emoteLog.filter((log: any) => log.action === action);
    return acc;
  }, {});
  let emotes = [... new Set(actions.reduce((acc: any[], action) => {
    const actionEmotes = actionEmoteLog[action].map((log: any) => log.emoji);
    return acc.concat(actionEmotes);
  }, []))];
  const emoteCounts = emotes.reduce((acc: any, emote) => {
    acc[emote] = actions.reduce((acc: number, action) => {
      const count = actionEmoteLog[action].filter((log: any) => log.emoji === emote).length;
      return acc + count;
    }, 0);
    return acc;
  }, {});
  emotes = emotes.sort((a: any, b: any) => emoteCounts[b] - emoteCounts[a]);
  const labels = emotes.map((emote: any) => emote.substring(1, emote.length - 1));
  const datasets = actions.map((action: any) => {
    const counts = emotes.map((emote: any) => {
      return actionEmoteLog[action].filter((log: any) => log.emoji === emote).length;
    });
    return {
      label: action,
      data: counts,
      backgroundColor: actionsAttributes[action].color,
    };
  });
  const data = {
    labels: labels,
    datasets: datasets,
  };

  return (
    <div>
      <div className='shadow-xl m-2'>
        <div className='flex'>
          <div className='m-4 flex-initial'>
            <label>Start Date: </label>
            <input type='date' />
          </div>
          <div className='m-4 flex-initial'>
            <label>End Date: </label>
            <input type='date' />
          </div>
          <button className='m-2 p-2 bg-blue-500 text-white shadow-sm shadow-blue-500/50 hover:bg-blue-600 active:bg-blue-700 transition-all'>Reset</button>
        </div>
        <div className='m-2'>
          <ul className='flex'>
            {uniqueChannels.map((channel: any) => (
              <li key={channel} className='m-2'>
                {channel}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <BarChart data={data} />
      </div>
    </div>
  );
}
