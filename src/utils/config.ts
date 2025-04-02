// src/utils/config.ts
import fs from 'fs';
import path from 'path';

const configPath = path.join(__dirname, '../../config.json');

let config: { [key: string]: string } = {};

if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

export const antiRaidConfig = {
    get(guildId: string): string | undefined {
        return config[guildId];
    },
    set(guildId: string, action: string): void {
        config[guildId] = action;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    },
    delete(guildId: string): void {
        delete config[guildId];
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    }
};