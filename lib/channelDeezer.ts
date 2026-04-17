import { ArtistResponseApi, DeezerAlbum, DeezerArtist, DeezerTrack } from "@/interfaces/api.interface";
import { UiArtist } from "@/interfaces/song.interface";
import { mapDeezerAlbumToUiAlbum, mapDeezerArtistToUiArtist, mapDeezerTrackToUiSong } from "@/mapper/deezer.mapper";


export const channelDeezer = async(artistId: string, limit: number = 5): Promise<ArtistResponseApi> => {

    try {

        const artist = await fetch(`https://api.deezer.com/artist/${artistId}`, {
            next: { revalidate: 300 }
        });
         
        if (!artist.ok) {
            return { ok: false, error: "No se pudo obtener el artista" };
        }

        const artistData = artist.ok ? await artist.json() : null;

        const [tracks, albums, relatedArtist] = await Promise.allSettled([
            fetch(`https://api.deezer.com/artist/${artistId}/top?limit=${limit}`, {
                next: { revalidate: 300 }
            }),
            fetch(`https://api.deezer.com/artist/${artistId}/albums`, {
                next: { revalidate: 300 }
            }),
            fetch(`https://api.deezer.com/artist/${artistId}/related`, {
                next: { revalidate: 300 }
            })
        ]);
    
        const formattedTracks = tracks.status === "fulfilled" && tracks.value.ok
            ? ((await tracks.value.json()) as { data: DeezerTrack[] }).data.map(mapDeezerTrackToUiSong)
            : [];       

        const formattedAlbums = albums.status === "fulfilled" && albums.value.ok
            ? ((await albums.value.json()) as { data: DeezerAlbum[] }).data.map(album => mapDeezerAlbumToUiAlbum(album))
            : [];

        const formattedRelated = relatedArtist.status === "fulfilled" && relatedArtist.value.ok
            ? ((await relatedArtist.value.json()) as { data: DeezerArtist[] }).data.map(mapDeezerArtistToUiArtist)
            : [];

        const formattedArtist: UiArtist = {
            ...mapDeezerArtistToUiArtist(artistData),
            relatedArtist: formattedRelated.map(a => a.id)
        }
            

    return {
        ok: true,
        data: {
            artist: formattedArtist,
            tracks: formattedTracks,
            albums: formattedAlbums,
            relatedArtist: formattedRelated
        }
    };

    } catch (error) {
        return {
            ok: false,
            error: "Error inesperado al obtener datos"
        }
    }
}