    "use client";

    import { useEffect } from "react";
    import { Loading } from "@/components/common/Loading";
    import { PlaylistCover } from "@/components/features/playlist/PlaylistCover";
    import { SongCard } from "@/components/features/song/SongCard";
    import { getOptionKey } from "@/helpers/getOptionKey";
    import { useCollectionSongs } from "@/hooks/features/playlist/useCollectionSongs";
    import { useCollectionType } from "@/hooks/features/playlist/useCollectionType";
    import { selectCollectionById } from "@/store/playlist/playlist.selector";
    import { RootState } from "@/store/store";
    import { useRouter, useSearchParams } from "next/navigation";
    import { useSelector } from "react-redux";
    import usePlaylistActions from "@/hooks/features/playlist/usePlaylistActions";
    import { selectSuggestions } from "@/store/songs/songs.selector";

    export default function PlaylistClient() {
        
        const router = useRouter();
        const params = useSearchParams();

        const playlistId = params.get("list");
        const artistId = params.get("artist");

        const id = artistId ?? playlistId

        const collection = useSelector((state: RootState) =>
            selectCollectionById(state, playlistId)
        );
        
        const source = useCollectionType()

        const suggestionSongs = useSelector((state: RootState) =>
            selectSuggestions(state, "playlist", playlistId)
        );

        const isArtist = source === "artist";

        const { songs, loading, album } = useCollectionSongs(id, source);
        const loadSuggestions = usePlaylistActions().setSuggestions;


        const isPlaylistView = source !== "artist";
        const hasSongs = songs?.length > 0;

        useEffect(() => {
            if (source === "playlist" && playlistId) {
                loadSuggestions(playlistId);
            }
        }, [source, playlistId]);
        
        if (!id) return null;

        if (!source) return null;

        if (loading) return <Loading type="data" />;

        if (!isArtist && !collection) {
            return (
                <div className="flex gap-x-2 text-white">
                    <span>No se encontró playlist: </span>
                    <button
                        onClick={() => router.replace("/")}
                        className="underline cursor-pointer"
                    >
                        Regresar
                    </button>
                </div>
            );
        }

        return (
            <>
                {!loading ? (
                    <div className={`flex ${isArtist ? "flex-col gap-y-4" : "flex-col lg:flex-row"} justify-around gap-x-10 w-full`}>
                        {isPlaylistView && playlistId ? (
                            <PlaylistCover
                                collection={collection}
                                playlistId={playlistId}
                                album={album}
                                source={source}
                            />
                        ) : (
                            <h2 className="font-semibold text-xl">Canciones más populares</h2>
                        )}

                        <div className="flex flex-col gap-y-6 lg:w-full">
                            <div className="flex flex-col gap-y-6">
                                <div className="flex flex-col gap-y-6">
                                    {!hasSongs ? (
                                        <span className="py-10 text-center text-neutral-400">
                                            No has guardado nada (aún)
                                        </span>
                                    ) : (
                                        songs.map(track => {
                                            const option = getOptionKey("song", track.id)
                                            return (
                                                <SongCard
                                                    playlistId={playlistId}
                                                    key={track.id}
                                                    song={track}
                                                    view="playlist"
                                                    source={source}
                                                    optionKey={option}
                                                    mode={playlistId ? undefined : "suggestion-standalone"}                                                />
                                                )
                                            })
                                        )}
                                </div>
                            </div>

                            {source === "playlist" && playlistId && (
                                <div>
                                    <h3 className="text-2xl font-semibold text-white">Sugerencias</h3>
                                    {suggestionSongs.map((track) => {
                                        const option = getOptionKey("song", track.id)

                                        return (
                                            <SongCard
                                                key={track.id}
                                                playlistId={playlistId}
                                                song={track}
                                                view="suggestion"
                                                mode="suggestion-standalone"
                                                optionKey={option}
                                            />
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <Loading type="data" />
                )}
            </>
        );
    }
