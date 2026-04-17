import { Preferences, Privacity } from "./common.interface";

export interface UiSong {
    id: string;
    title: string;
    duration: number;
    preview?: string;

    artistId: string;
    artistName: string;

    albumId?: string;
    albumTitle: string;
    cover: string;

    liked: Preferences;
}

export interface UiArtist {
    id: string;
    name: string;
    cover_profile: string;
    fans?: string;
    relatedArtist?: string[]
}

export interface UiAlbum {
    id: string;
    title: string;
    cover: string[];
    year: string;
    songIds: string[];
    duration: string;
    artistId?: string;
    artistName?: string;
}

export interface Playlist {
    id: string;
    title: string;
    cover: string[];
    year: string;
    privacity: Privacity;
    duration: string;
    songIds: string[];
    description?: string;
}
