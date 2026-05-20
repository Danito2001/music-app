import { DeezerAlbum, DeezerArtist, DeezerTrack } from "@/interfaces/api.interface";
import { UiArtist } from "@/interfaces/song.interface";
import { mapDeezerAlbumToUiAlbum, mapDeezerArtistToUiArtist, mapDeezerTrackToUiSong } from "@/mapper/deezer.mapper";
import axiosServer from "@/utils/axios.server";


export async function GET(
    req:Request, 
    {params}: {params: Promise<{ id: string }>}
) {

    const { searchParams } = new URL(req.url);

    const { id } = await params;
    const limit = searchParams.get("limit") || 5;

    if (!id) {
        return Response.json(
            { message: "Parametro requerido" },
            { status: 400 }
        );
    }

    try {

        const [ artist, topTracks, albums, relatedArtist ] = await Promise.all([
            axiosServer.get<DeezerArtist>(`/artist/${id}`),
            axiosServer.get<{ data: DeezerTrack[] }>(`/artist/${id}/top?limit=${limit}`),
            axiosServer.get<{ data: DeezerAlbum[] }>(`/artist/${id}/albums`),
            axiosServer.get<{ data: DeezerArtist[] }>(`/artist/${id}/related`),
        ])

        const tracks = topTracks.data.data.map(track => mapDeezerTrackToUiSong(track));

        const formattedAlbums = albums.data.data.map(album => mapDeezerAlbumToUiAlbum(album));

        const formattedRelated= relatedArtist.data.data.map(artist => mapDeezerArtistToUiArtist(artist));

        const formattedArtist: UiArtist = {
            ...mapDeezerArtistToUiArtist(artist.data),
            relatedArtist: formattedRelated.map(a => a.id)
        }

        return Response.json({
            artist: formattedArtist,
            topTracks: tracks,
            albums: formattedAlbums,
            relatedArtist: formattedRelated
        });

    } catch (error) {
        console.error(error);
        return Response.json(
            { message: "Error al intentar acceder al artista"},
            { status: 500}
        )
    }
}