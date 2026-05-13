import { Button } from "@heroui/react";
import { useSelector } from "react-redux";
import { SongCard } from "../../song/SongCard";
import { useUIContext } from "@/context/ui.context";
import { RootState } from "@/store/store";
import { Loading } from "@/components/common/Loading";
import { selectQueueSongIds } from "@/store/player/player.selector";
import { getOptionKey } from "@/helpers/getOptionKey";
import { QueueSections } from "@/interfaces/player.interface";

export default function RelatedSongs({ queueSongs }: { queueSongs: QueueSections }) {

    const modalOpen = useUIContext().modalOpen;
    const loading = useSelector((state: RootState) => state.songs.suggestions.loading)
    const currentQueueSongs = useSelector(selectQueueSongIds)

    const { manual, suggestions } = queueSongs;

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
            <div className="flex flex-col gap-y-4 mb-17.5 scrollbar h-85 lg:mb-0">

                {manual.map(({ queueId, song }) => {
                    const option = getOptionKey("song-queue", song.id);

                    return (
                        <SongCard
                            key={queueId}
                            playlistId={null}
                            queueId={queueId}
                            song={song}
                            view="queue"
                            mode="queue"
                            optionKey={option}
                        />
                    );
                })}

                {loading ? (
                    <Loading type="data" />
                ) : suggestions.length > 0 ? (
                    <>
                        <h4 className="font-semibold opacity-70 mt-4 text-white">
                            Sugerencias
                        </h4>

                        {suggestions.map(({ song }) => {
                            const option = getOptionKey(
                                "song-suggestion",
                                song.id
                            );

                            return (
                                <SongCard
                                    key={song.id}
                                    playlistId={null}
                                    song={song}
                                    view="suggestion-queue"
                                    mode="suggestion-queue"
                                    optionKey={option}
                                />
                            );
                        })}
                    </>
                ) : null}
            </div>
        </section>
    )

}