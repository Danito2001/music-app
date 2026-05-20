import { RootState } from "@/store/store";
import { Privacity } from "./common.interface";

export type SourceType = "playlist" | "album" | "liked";
export type GetSongIdsFn = (state: RootState, id: string) => string[]

export interface BaseCollection {
    id: string;
    title: string;
    year: string;
    duration: string;
    cover: string[];
    songIds: string[];
}

export interface PlaylistCollection extends BaseCollection {
    songIds: string[];
    description?: string;
    privacity: Privacity;
    type: "playlist";
}

export interface AlbumCollection extends BaseCollection {
    artistId: string;
    artistName: string;
    type: "album";
}

export interface LikedCollection extends BaseCollection {
    type: "liked";
}

export type CollectionView =
    | PlaylistCollection
    | AlbumCollection
    | LikedCollection