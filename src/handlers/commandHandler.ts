// src/handlers/commandHandler.ts
import { Client, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { Command } from '../types';
import { logger } from '../utils/logger';

export async function registerCommands(client: Client) {
  client.commands = new Collection();
  client.musicStates = new Collection();
  client.warnSettings = new Collection();

  const commandsPath = join(__dirname, '..', 'commands');
  const commandFolders = readdirSync(commandsPath);

  for (const folder of commandFolders) {
    const commandFiles = readdirSync(join(commandsPath, folder))
      .filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of commandFiles) {
      try {
        const { command } = require(join(commandsPath, folder, file));
        if ('data' in command && 'execute' in command) {
          client.commands.set(command.data.name, command);
        }
      } catch (error) {
        logger.error(`Error loading command ${file}:`, error);
      }
    }
  }
}