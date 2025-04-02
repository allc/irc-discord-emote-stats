'use client';
import { useEffect, useState } from 'react';
import BarChart from './BarChart'
import { channel } from 'diagnostics_channel';

export default function Dashboard({ emoteLog }: any) {
  const [barChartData, setBarChartData] = useState<{ labels: string[], datasets: any[] }>({ labels: [], datasets: [] });
  const [channels, setChannels] = useState<string[]>([]);
  const [channelFilter, setChannelFilter] = useState<{ [channel: string]: boolean }>({});

  const setChannels_ = () => {
    const channels_: string[] = emoteLog.map((log: any) => log.channel);
    const channels: string[] = [...new Set(channels_)];
    setChannels(channels);

    const channelFilter_: { [channel: string]: boolean } = {};
    channels.forEach((channel: string) => {
      channelFilter_[channel] = true;
    });
    setChannelFilter(channelFilter_);
  }

  const setBarChartData_ = (
    start_time: number | undefined = undefined,
    end_time: number | undefined = undefined) => {
    if (start_time === undefined) {
      start_time = 0;
    }
    if (end_time === undefined) {
      end_time = Date.now() + 5000;
    }

    const filteredEmoteLog = emoteLog.filter((log: any) => {
      return log.timestamp >= start_time && log.timestamp <= end_time && channelFilter[log.channel];
    });

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
      acc[action] = filteredEmoteLog.filter((log: any) => log.action === action);
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
    setBarChartData(data);
  };

  useEffect(() => {
    setChannels_();
    setBarChartData_();
  }, [emoteLog]);

  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(Date.now() + 5000);

  useEffect(() => {
    setBarChartData_(startTime, endTime);
  }, [startTime, endTime, channelFilter]);

  return (
    <div>
      <div className='shadow-xl m-2'>
        <div className='flex'>
          <div className='m-4 flex-initial'>
            <label htmlFor='startDate'>Start Date: </label>
            <input
              id='startDate'
              type='date'
              onChange={(e) => {
                setStartTime(new Date(e.target.value).getTime());
              }}
            />
          </div>
          <div className='m-4 flex-initial'>
            <label htmlFor='endDate'>End Date: </label>
            <input
              id='endDate'
              type='date'
              onChange={(e) => {
                setEndTime(new Date(e.target.value).getTime());
              }}
            />
          </div>
          <button className='m-2 p-2 bg-blue-500 text-white shadow-sm shadow-blue-500/50 hover:bg-blue-600 active:bg-blue-700 transition-all'>Reset</button>
        </div>
        <div className='m-2'>
          <ul className='flex'>
            {channels.map((channel: any) => (
              <li
                key={channel}
                className={`m-2 cursor-default ${channelFilter[channel] ? '' : 'line-through'}`}
                onClick={() => {
                  setChannelFilter((prev: any) => {
                    const newFilter = { ...prev };
                    newFilter[channel] = !newFilter[channel];
                    return newFilter;
                  });
                }}
              >
                {channel}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <BarChart data={barChartData} />
      </div>
    </div>
  );
}
