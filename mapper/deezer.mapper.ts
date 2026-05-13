import { DeezerAlbum, DeezerArtist, DeezerTrack } from "@/interfaces/api.interface"
import { UiAlbum, UiArtist, UiSong } from "@/interfaces/song.interface"

export const mapDeezerArtistToUiArtist = (artist:DeezerArtist):UiArtist => {
    return {
        id: artist.id.toString(),
        name: artist.name,
        cover_profile: artist.picture_big,
        fans: artist.nb_fan?.toString(),
        relatedArtist: []
    }
}

export const mapDeezerAlbumToUiAlbum = 
    (album:DeezerAlbum, artistId?: string): UiAlbum => {

        if (!album || !album.id) {
            throw new Error("Invalid album data from API");
        }

        const year = album?.release_date 
            ? new Date(album.release_date).getFullYear()
            : ""

        return {
            id: album.id.toString(),
            cover: [album.cover],
            title: album.title,
            year: year.toString(),
            artistId,
            artistName: album.artist?.name ?? "",
            duration: album?.duration?.toString(),
            songIds: []
        }
}

export const mapDeezerTrackToUiSong = (track: DeezerTrack): UiSong => {

    return {
        id: track.id.toString(),
        title: track.title,
        duration: track.duration,
        preview: track.preview,

        artistId: track.artist.id.toString(),
        artistName: track.artist.name,
    
        albumId: track?.album?.id?.toString(),
        albumTitle: track?.album?.title ?? "",
        cover: track?.album?.cover_big ?? "/DefaultCover",
        liked: "neutral"
    }
}