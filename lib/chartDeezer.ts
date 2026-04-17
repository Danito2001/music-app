import { ChartResponse, DeezerAlbum, DeezerArtist, DeezerTrack } from "@/interfaces/api.interface"
import { mapDeezerAlbumToUiAlbum, mapDeezerArtistToUiArtist, mapDeezerTrackToUiSong } from "@/mapper/deezer.mapper"


export const chartDeezer = async(): Promise<ChartResponse> => {

    try {
        const [ tracks, artists, albums ] = await Promise.allSettled([
            fetch("https://api.deezer.com/chart/0/tracks", {
                next: { revalidate: 300 }
            }),
            fetch("https://api.deezer.com/chart/0/artists", {
                next: { revalidate: 300 }
            }),
            fetch("https://api.deezer.com/chart/0/albums", {
                next: { revalidate: 300 }
            }),
        ])

        const formattedTracks = tracks.status === "fulfilled" && tracks.value.ok
            ? ((await tracks.value.json()) as { data: DeezerTrack[] }).data.map(mapDeezerTrackToUiSong)
            : []
        
        const formattedArtists = artists.status === "fulfilled" && artists.value.ok
            ? ((await artists.value.json()) as { data: DeezerArtist[] }).data.map(mapDeezerArtistToUiArtist)
            : []

        const formattedAlbums = albums.status === "fulfilled" && albums.value.ok
            ? ((await albums.value.json()) as { data: DeezerAlbum[] } ).data.map(album => mapDeezerAlbumToUiAlbum(album))
            : []

        return ({
            tracks: formattedTracks,
            artists: formattedArtists,
            albums: formattedAlbums
        })

    } catch (error) {
        console.log(error)

        return {
            tracks: [],
            artists: [],
            albums: []
        }
    }
}