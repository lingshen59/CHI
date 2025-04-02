// src/utils/config.d.ts
declare module 'utils/config.js' {
    export const antiRaidConfig: {
        get(guildId: string): string | undefined;
        set(guildId: string, action: string): void;
        delete(guildId: string): void;
    };
}