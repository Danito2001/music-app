import { Button } from "@heroui/react";
import { useSelector } from "react-redux";
import { SongCard } from "../../song/SongCard";
import { useUIContext } from "@/context/ui.context";
import { RootState } from "@/store/store";
import { Loading } from "@/components/common/Loading";
import { selectPlaylistSuggestionSong } from "@/store/playlist/playlist.selector";
import { selectQueueSongs } from "@/store/player/player.selector";
import { getOptionKey } from "@/helpers/getOptionKey";
import { UiSong } from "@/interfaces/song.interface";

interface QueueSong {
    queueId: string;
    song: UiSong;
}

export default function RelatedSongs({ queueSongs }: { queueSongs: QueueSong[] }) {

    const modalOpen = useUIContext().modalOpen;

    const loading = useSelector((state: RootState) => state.songs.playlistSuggestions.loading)
    const suggestionSongs = useSelector(selectPlaylistSuggestionSong)
    const currentQueueSongs = useSelector(selectQueueSongs).map(songs => songs.song.id)

    return (
        <section className="flex flex-col gap-y-4 pt-6 text-white">
            <span className="border-b border-b-white text-xs mx-auto font-bold w-fit">
                A CONTINUACÍON
            </span>
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <span>Reproduciendo desde</span>
                    <span className="font-semibold">Fila</span>
                </div>
                <Button
                    size="md"
                    radius="full"
                    className="bg-white text-black"
                    onPress={() => modalOpen({
                        type: "saveSong", props: {
                            songIds: currentQueueSongs
                        }
                    })}
                >
                    Guardar
                </Button>
            </div>

            {/* related songs */}
            <div className="flex flex-col gap-y-4 mb-[70px] scrollbar h-[340px] lg:mb-0">
                {queueSongs.map(({ queueId, song }) => {
                    const option = getOptionKey("song-queue", song.id)

                    return (
                        <SongCard
                            key={queueId}
                            queueId={queueId}
                            song={song}
                            view="queue"
                            mode="queue"
                            optionKey={option}
                        />
                    )
                })}

                {loading ? (
                    <Loading type="data" />
                ) : (
                    <>
                        <h4 className="font-semibold opacity-70 mt-4 text-white">Sugerencias</h4>
                        {suggestionSongs.map(track => {
                            const option = getOptionKey("song-suggestion", track.id)

                            return (
                                <SongCard
                                    key={track.id}
                                    song={track}
                                    view="suggestion-queue"
                                    mode="suggestion-queue"
                                    optionKey={option}
                                />
                            )
                        })}
                    </>

                )}
            </div>
        </section>
    )

}