import axiosServer from "@/utils/axios.client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { upsertManyToCatalog } from "@/store/songs/songsSlice";
import { Loading } from "@/components/common/Loading";
import { SongCard } from "../../song/SongCard";
import { getOptionKey } from "@/helpers/getOptionKey";
import { UiSong } from "@/interfaces/song.interface";
import { Divider } from "@/components/common/Divider";
import { trackListService } from "@/services/deezer";


export default function TrackList({ q }: { q: string | null }) {

    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [tracks, setTracks] = useState<UiSong[]>([]);

    const type = "track"

    useEffect(() => {
        if (!q) return;

        const fetch = async () => {
            try {
                setLoading(true)

                const response = await trackListService(q, type)

                setTracks(response)
                dispatch(upsertManyToCatalog(response))
            } catch (error) {
                console.log({ "error": error })
            } finally {
                setLoading(false)
            }
        }
        fetch();
    }, [q, dispatch])

    return (
        <div>
            {loading ? (
                <Loading type="data" />
            ) : (
                tracks.map(track => {
                    const option = getOptionKey("song-search", track.id)

                    return (
                        <div className="flex flex-col gap-y-2 py-1" key={track.id}>
                            <SongCard
                                song={track}
                                view="queue"
                                mode="suggestion-standalone"
                                optionKey={option}
                            />
                            <Divider />
                        </div>
                    )
                }
            ))}
        </div>
    )

}