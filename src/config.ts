// src/config.ts
export const config = {
  ownerID: process.env.OWNER_ID || '',
  logChannel: process.env.LOG_CHANNEL || '',
  defaultPrefix: '!',
  embedColor: '#0099ff',
  musicSettings: {
    defaultVolume: 100,
    maxVolume: 200,
    leaveOnEnd: true,
    leaveOnEmpty: true,
  }
};