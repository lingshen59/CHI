// src/types/MusicState.ts

import { Song } from './Song.js';

export interface MusicState {
    queue: Song[];
    currentSong?: Song;
    isPlaying: boolean;
    volume: number;
    loop: boolean;
    autoplay: boolean;
}