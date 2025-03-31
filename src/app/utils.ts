import { PrismaClient } from "@prisma/client";
import Database from "better-sqlite3";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function getOrInitApp() {
  const app = await prisma.app.findFirst();
  if (!app) {
    return await prisma.app.create({
      data: {
      },
    });
  }
  return app;
}

export async function syncFromChatLog(start_time: number | undefined = undefined, end_time: number | undefined = undefined) { // start and end time are not inclusive
  if (start_time === undefined) {
    start_time = await getLastEmoteTimestamp();
  }
  if (end_time === undefined) {
    end_time = new Date().getTime() + 5000;
  }

  const logFile = process.env.CHATLOG_DATABASE;
  const log = new Database(logFile);
  const rows = log.prepare("SELECT * FROM messages WHERE time > ? AND time < ? ORDER BY time").all(start_time, end_time);

  const emoteLog: any[] = [];
  rows.forEach((row: any) => {
    const channel = row.channel;
    const timestamp = row.time;
    let action = row.type;
    const msg = row.msg;

    const msgHash = crypto.createHash('sha256').update(msg).digest('hex');
    const text = JSON.parse(msg).text;

    let emotes: any[] = [];
    if (action == 'action') {
      emotes = extractReactionEmote(text);
      action = 'reaction';
    }
    if (action == 'message') {
      emotes = extractMessageEmotes(text);
    }

    emotes.forEach((emote) => {
      emoteLog.push({
        channel: channel,
        timestamp: timestamp,
        action: action,
        emoji: emote,
        msgHash: msgHash,
      });
    })
  })

  // doesnt work for SQLite
  // await prisma.emoteLog.createMany({
  //   data: emoteLog,
  //   skipDuplicates: true,
  // })

  // upsert hack
  emoteLog.forEach(async (entry) => {
    await prisma.emoteLog.upsert({
      where: {
        channel_emoji_action_timestamp_msgHash: entry,
      },
      create: entry,
      update: {},
    })
  })
}

function extractReactionEmote(text: string) {
  const match = text.match(/reacted with (:[a-zA-Z0-9_]{2,}:)/);
  if (match) {
    return [match[1]];
  }
  return [];
}

function extractMessageEmotes(text: string) {
  const matches = text.match(/:[a-zA-Z0-9_]{2,}:/g);
  if (matches) {
    const unique = matches.filter((value, index) => matches.indexOf(value) === index); // remove duplicates
    return unique;
  }
  return [];
}

async function getLastEmoteTimestamp() {
  const lastEmote = await prisma.emoteLog.findFirst({
    orderBy: {
      timestamp: 'desc',
    },
  });
  if (lastEmote) {
    return lastEmote.timestamp;
  }
  return 0;
}

export async function getEmoteLog(start_time: number | undefined = undefined, end_time: number | undefined = undefined) { // start and end time are inclusive
  if (start_time === undefined) {
    start_time = 0;
  }
  if (end_time === undefined) {
    end_time = new Date().getTime() + 5000;
  }

  const emoteLog = await prisma.emoteLog.findMany({
    where: {
      timestamp: {
        gte: start_time,
        lte: end_time,
      },
    },
    orderBy: {
      timestamp: 'asc',
    },
    select: {
      channel: true,
      timestamp: true,
      action: true,
      emoji: true,
    },
  });
  return emoteLog;
}