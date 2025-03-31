// src/types/index.ts
import { ChatInputCommandInteraction, Client, Collection, SlashCommandBuilder } from 'discord.js';

export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export interface MusicState {
  queue: Song[];
  currentSong?: Song;
  isPlaying: boolean;
  volume: number;
  loop: boolean;
  autoplay: boolean;
}

export interface Song {
  title: string;
  url: string;
  duration: string;
  thumbnail: string;
  author: string;
  requestedBy: string;
}

export interface WarnSettings {
  maxWarns: number;
  action: 'kick' | 'ban';
}

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, Command>;
    musicStates: Collection<string, MusicState>;
    warnSettings: Collection<string, WarnSettings>;
  }
}