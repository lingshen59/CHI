// src/types/Client.ts
import { Client, Collection } from 'discord.js';
import { Command } from './Command.js';
import { MusicState } from './MusicState.js';
import { WarnSettings } from './WarnSettings.js';

// Augment the Client interface to include custom properties
declare module 'discord.js' {
    interface Client {
        commands: Collection<string, Command>;
        musicStates: Collection<string, MusicState>;
        warnSettings: Collection<string, WarnSettings>;
    }
}

export { };