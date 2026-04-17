import { UiAlbum, UiArtist, UiSong } from "./song.interface";


export type ArtistResponse = {
    artist: UiArtist;
    tracks: UiSong[];
    albums: UiAlbum[];
    relatedArtist: UiArtist[];
}

export type ArtistResponseApi = 
    | {
        ok: true;
        data: ArtistResponse
      }
    | {
        ok: false;
        error: string;
      };

export type ChartResponse = {
    tracks: UiSong[];
    artists: UiArtist[];
    albums: UiAlbum[];
}

export type AlbumResponse = {
    album: UiAlbum,
    tracks: UiSong[]
}

export type SearchResponse = {
    tracks: UiSong[];
    artists: UiArtist[];
    albums: UiAlbum[];
}


export type SearchResults = {
tracks: UiSong[];
albums: UiAlbum[];
artists: UiArtist[];
};

export type SearchParams = {
    q: string,
    limit: number
}

export interface DeezerTrack {
    id: number;
    title: string;
    duration: number;
    preview: string;
    artist: {
        id: number;
        name: string;
    };
    album: {
        id: number;
        title: string;
        cover_big: string;
    };
}

export interface DeezerArtist {
    id: number;
    name: string;
    picture_big: string;
    nb_fan?: number;
}

export interface DeezerAlbum {
    id: number;
    cover: string;
    title: string;
    release_date?: string;
    duration: number;
    artist: {
        name?: string;
    }
}