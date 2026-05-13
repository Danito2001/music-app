"use client";

import { SongCard } from "@/components/features/song/SongCard";
import { getOptionKey } from "@/helpers/getOptionKey";
import { selectHistorySong } from "@/store/songs/songs.selector";
import { useSelector } from "react-redux";

export default function ListenAgain() {

    const historySongs = useSelector(selectHistorySong)

    return (
        <div className="text-neutral-400">
            {
                historySongs.length === 0 ? (
                    <div className="text-center py-10">
                        <p>No has reproducido ninguna canción todavía.</p>
                        <p className="text-sm">Empieza a escuchar música para ver tu historial aquí.</p>
                    </div>
                ) : (
                    <div>
                        <h3 className="p-2 font-semibold text-2xl">Volver a escuchar</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {historySongs.map(track => {
                                const option = getOptionKey("song-history", track.id)

                                return (
                                    <SongCard
                                        key={track.id}
                                        playlistId={null}
                                        song={track}
                                        view="large"
                                        mode="suggestion-standalone"
                                        optionKey={option}
                                    />
                                )
                            })}
                        </div>
                    </div>
                )
            }
        </div>

    )

}