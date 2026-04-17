import { DeezerAlbum, DeezerTrack } from "@/interfaces/api.interface";
import { searchDeezer } from "@/lib/searchDeezer";
import { mapDeezerAlbumToUiAlbum, mapDeezerArtistToUiArtist, mapDeezerTrackToUiSong } from "@/mapper/deezer.mapper";
import axiosServer from "@/utils/axios.server";

const searchType = ["artist", "album", "track"] as const
type SearchType = typeof searchType[number]

function isValidType(value: string): value is SearchType{
    return searchType.includes(value as SearchType)
}

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url);

    // pagination
    const limit: number = Number(searchParams.get("limit")) || 5;
    const index: number = Number(searchParams.get("index")) || 0;

    const q = searchParams.get("q");
    const type = searchParams.get("type")

    if (!q) {
        return Response.json(
            { message: "Query requerida" },
            { status: 400 }
        );
    }

    try {

        if (type && isValidType(type)) {
            switch (type) {
                case "track": {
                    const { data } = await axiosServer.get<{ data: DeezerTrack[] }>("https://api.deezer.com/search",
                    { params: { q, limit, index } })
    
                    return Response.json(data.data.map(mapDeezerTrackToUiSong))
                }
                
                case "album": {
                    const { data } = await axiosServer.get<{ data: DeezerAlbum[] }>("https://api.deezer.com/search/album",
                    { params: { q, limit, index } })

                    return Response.json(data.data.map(album => mapDeezerAlbumToUiAlbum(album)))
                }

                case "artist": {
                    const { data } = await axiosServer.get("https://api.deezer.com/search/artist",
                    { params: { q, limit, index } })
    
                    return Response.json(data.data.map(mapDeezerArtistToUiArtist))
                }

            default:
                return Response.json({ message: "Tipo inválido" }, { status: 400 })
            }
        }
    
        const response = await searchDeezer(q, limit)
        return Response.json(response)

    } catch (error) {
		console.error(error);
        return Response.json(
            { message: "Error al intentar buscar"},
            { status: 500}
        )
    }   
}