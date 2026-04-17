import { DeezerArtist } from "@/interfaces/api.interface";
import { mapDeezerArtistToUiArtist } from "@/mapper/deezer.mapper";
import axiosServer from "@/utils/axios.server";


export async function GET(req: Request) {

    const { searchParams } = new URL(req.url);

    const artistId = searchParams.get("id");
    const limit = searchParams.get("limit") || 3;


    if (!artistId) {
        return Response.json(
            { message: "Parametro requerido" },
            { status: 400 }
        );
    }

    try {

        const response = await axiosServer.get<{ data: DeezerArtist[] }>(`/artist/${artistId}/related?limit=${limit}`);
        const formattedArtist = response.data.data.map(artist => mapDeezerArtistToUiArtist(artist));

        return Response.json(formattedArtist);

    } catch (error) {
        console.error(error);
        return Response.json(
            { message: "Error al intentar acceder al artista"},
            { status: 500}
        )
    }
}