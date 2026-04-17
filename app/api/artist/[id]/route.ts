import { DeezerAlbum, DeezerArtist, DeezerTrack, UiArtist } from "@/interfaces/playlist.interface";
import { mapDeezerAlbumToUiAlbum, mapDeezerArtistToUiArtist, mapDeezerTrackToUiSong } from "@/mapper/deezer.mapper";
import axiosServer from "@/utils/axios.server";


export async function GET(req:Request, {params}: {params: { id: string }}) {

    const { searchParams } = new URL(req.url);

    const artistId = params.id;
    const limit = searchParams.get("limit") || 5;

    if (!artistId) {
        return Response.json(
            { message: "Parametro requerido" },
            { status: 400 }
        );
    }

    try {

        const [ artist, topTracks, albums, relatedArtist ] = await Promise.all([
            axiosServer.get<DeezerArtist>(`/artist/${artistId}`),
            axiosServer.get<{ data: DeezerTrack[] }>(`/artist/${artistId}/top?limit=${limit}`),
            axiosServer.get<{ data: DeezerAlbum[] }>(`/artist/${artistId}/albums`),
            axiosServer.get<{ data: DeezerArtist[] }>(`/artist/${artistId}/related`),
        ])


        const tracks = topTracks.data.data.map(track => mapDeezerTrackToUiSong(track));

        const formattedAlbums = albums.data.data.map(album => mapDeezerAlbumToUiAlbum(album, artistId));

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