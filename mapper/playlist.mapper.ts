import { getPlaylistCover } from "@/helpers/getPlaylistCover";
import { AlbumCollection, LikedCollection, Playlist, PlaylistCollection, UiAlbum, UiSong } from "@/interfaces/playlist.interface";

export const mapPlaylistToCollection = (playlist: Playlist, entities: Record<string, UiSong>): PlaylistCollection => {

    const covers = getPlaylistCover(playlist, entities)

    return ({
        id: playlist.id,
        title: playlist.title,
        cover: covers,
        year: playlist.year,
        songIds: playlist.songIds,
        description: playlist.description,
        duration: playlist.duration,
        privacity: playlist.privacity,
        type: "playlist"
    })
}

export const mapAlbumToCollection = (album:UiAlbum): AlbumCollection => ({
    id: album.id,
    title: album.title,
    cover: album.cover,
    year: album.year,
    songIds: album.songIds,
    duration: album.duration,
    type: "album",
})

export const mapLikedToCollection = (likedIds: string[]): LikedCollection => ({
    id: "LM",
    title: "Musica que te gustó",
    year: new Date().getFullYear().toString(),
    songIds: likedIds,
    duration: "0:00",
    cover: [],
    type: "liked"
});