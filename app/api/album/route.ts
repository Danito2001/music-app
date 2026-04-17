import { DeezerAlbum, DeezerTrack } from "@/interfaces/api.interface";
import { mapDeezerAlbumToUiAlbum, mapDeezerTrackToUiSong } from "@/mapper/deezer.mapper";
import axiosServer from "@/utils/axios.server";

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url);

    const albumId = searchParams.get("list")
    const type = searchParams.get("type")

    if (!albumId) {
        return Response.json(
            { message: "No se proporciono ningun id"},
            { status: 404 }
        )
    }

    try {

        if (type === "tracks") {
            const { data } = await axiosServer.get<{ data: DeezerTrack[] }>(
                `/album/${albumId}/tracks`
            )

            return Response.json({
                tracks: data.data.map(mapDeezerTrackToUiSong)
            })
        }
        
        const [ album, albumTracks ] = await Promise.all([
            axiosServer.get<DeezerAlbum>(`/album/${albumId}`),
            axiosServer.get<{ data: DeezerTrack[] }>(`/album/${albumId}/tracks`)
        ])

        const formattedAlbum = mapDeezerAlbumToUiAlbum(album.data)
        const formattedTracks = albumTracks.data.data.map(track => mapDeezerTrackToUiSong(track))

        return Response.json({
            album: formattedAlbum,
            tracks: formattedTracks
        })
    } catch (error) {
        console.log(error)
        return Response.json(
            { message: "Error al intentar obtener el album"},
            { status: 500 }
        )
    }

}