import { DeezerTrack } from "@/interfaces/playlist.interface";
import { mapDeezerTrackToUiSong } from "@/mapper/deezer.mapper";
import axiosServer from "@/utils/axios.server";


export async function GET(req: Request) {

    const { searchParams } = new URL(req.url); 

    const artistId = searchParams.get("id");
    const limit = searchParams.get("limit") || 5;

    if (!artistId) {
        return Response.json(
            { message: "Parametro requerido" },
            { status: 400 }
        );
    }

    try {

        const response = await axiosServer.get<{ data: DeezerTrack[] }>(`/artist/${artistId}/top?limit=${limit}`)
        const formattedTracks = response.data.data.map(track => mapDeezerTrackToUiSong(track))

        return Response.json(formattedTracks);
    } catch (error) {
        console.error(error);
        return Response.json(
            { message: "Error al intentar acceder al artista"},
            { status: 500}
        )
    }

} 