import { DeezerAlbum, DeezerArtist, DeezerTrack } from "@/interfaces/api.interface"
import { mapDeezerAlbumToUiAlbum, mapDeezerArtistToUiArtist, mapDeezerTrackToUiSong } from "@/mapper/deezer.mapper"
import axiosServer from "@/utils/axios.server"


export const searchDeezer = async(q: string, limit: number) => {

    const [ tracksRes, albumsRes, artistsRes ] = await Promise.allSettled([
        axiosServer.get<{ data: DeezerTrack[] }>('https://api.deezer.com/search', { params: {q, limit} }),
        axiosServer.get<{ data: DeezerAlbum[] }>('https://api.deezer.com/search/album', { params: {q, limit} }),
        axiosServer.get<{ data: DeezerArtist[] }>('https://api.deezer.com/search/artist', { params: {q, limit} }),
    ])

    const tracks = tracksRes.status === "fulfilled" ? tracksRes.value.data.data.map(track => mapDeezerTrackToUiSong(track)) : []
    const albums = albumsRes.status === "fulfilled" ? albumsRes.value.data.data.map(album => mapDeezerAlbumToUiAlbum(album)) : []
    const artists = artistsRes.status === "fulfilled" ? artistsRes.value.data.data.map(artist => mapDeezerArtistToUiArtist(artist)) : []

    return {
        tracks,
        albums,
        artists
    }
}