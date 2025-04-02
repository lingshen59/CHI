// src/types/index.ts
import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';

export interface Command {
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
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