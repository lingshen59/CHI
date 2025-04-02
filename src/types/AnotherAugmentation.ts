// src/types/AnotherAugmentation.ts
import { Client, Collection } from 'discord.js';
import { AnotherCustomType } from '../AnotherCustomType.js'; // Corrected path

// Augment the Client interface to include additional custom properties
declare module 'discord.js' {
    interface Client {
        anotherCustomProperty: Collection<string, AnotherCustomType>;
    }
}