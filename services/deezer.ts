import { AlbumResponse, SearchParams } from "@/interfaces/api.interface";
import { UiAlbum, UiArtist, UiSong } from "@/interfaces/song.interface";
import { channelDeezer } from "@/lib/channelDeezer";
import { chartDeezer } from "@/lib/chartDeezer";
import { searchDeezer } from "@/lib/searchDeezer";
import axiosServer from "@/utils/axios.client";


export const getRelatedService = async(artistId: string) => {
    const response = await axiosServer.get<UiArtist[]>("/related", {params: {id: artistId}})
    return response.data;
}

export const getTracksService = async(artistId: string, limit: number) => {

    const response = await axiosServer.get<UiSong>("/tracks", {
        params: {
            id: artistId,
            limit: limit
        }
    })

    return response.data;
}

export const searchService = async(params: SearchParams) => {
    const response = await searchDeezer(params.q, params.limit)
    return response
}

export const previewSearchService = async(query: string) => {
    const [ tracks, artist ] = await Promise.all([
        axiosServer.get<UiSong[]>("/search", {params: {q:query, limit:5, type: "track"}}),
        axiosServer.get<UiArtist[]>("/search", {params: {q:query, limit:1, type: "artist"}})
    ])

    return {
        tracks,
        artist
    }
}

export const homeService = async() => {
    const response = await chartDeezer()
    return response
}

export const channelService = async(artistId: string) => {
    const response = await channelDeezer(artistId)
    return response
}

export const trackListService = async(q: string, type: string) => {
    const response = await axiosServer.get<UiSong[]>("/search", {
        params: { q, limit: 20, type }
    })
    return response.data
}

export const artistListService = async(q: string, type: string) => {
    const response = await axiosServer.get<UiArtist[]>("/search", {
        params: {q, limit:20, type}
    })
    return response.data
}

export const albumListService = async(q: string, type: string) => {
    const response = await axiosServer.get<UiAlbum[]>("/search", {
        params: { q, limit: 20, type }
    })
    return response.data
}

export const albumTracksService = async(playlistId: string) => {
    const response = await axiosServer.get<AlbumResponse>("/album", {
        params: { list: playlistId }
    });
    return response.data
}