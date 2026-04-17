import axiosServer from "@/utils/axios.client";
import { useEffect, useState } from "react";
import { Loading } from "../../../common/Loading";
import { AlbumCard } from "../../song/AlbumCard";
import { Divider } from "@heroui/react";
import { UiAlbum } from "@/interfaces/song.interface";
import { albumListService } from "@/services/deezer";

export default function AlbumList({ q }: { q: string | null }) {


    const [ loading, setLoading ] = useState(false);
    const [ albums, setAlbums ] = useState<UiAlbum[]>([]);

    const type = "album"

    useEffect(() => {
        if (!q) return;

        const fetch = async () => {
            try {
                setLoading(true)

                const response = await albumListService(q, type)

                setAlbums(response)
            } catch (error) {
                console.log({ "error": error })
            } finally {
                setLoading(false)
            }
        }
        fetch();
    }, [q])

    return (
        <div>
            {loading ? (
                <Loading type="data" />
            ) : (
                albums.map(album =>
                    <div className="flex flex-col gap-y-2 py-1" key={album.id}>
                        <AlbumCard
                            album={album}
                            size="sm"
                            isRow
                            viewType="album"
                        />
                        <Divider />
                    </div>
                )
            )}
        </div>
    )
}