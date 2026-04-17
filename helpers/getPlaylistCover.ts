import { Playlist, UiSong } from "@/interfaces/song.interface";


export const getPlaylistCover = (playlist: Pick<Playlist, "songIds">, entities: Record<string, UiSong>) => 
    playlist.songIds
        .slice(0, 4)
        .map(id => entities[id]?.cover)
        .filter(Boolean);
