"use client";

import { Loading } from "@/components/common/Loading";
import { PlaylistCover } from "@/components/features/playlist/PlaylistCover";
import { SongCard } from "@/components/features/song/SongCard";
import { getOptionKey } from "@/helpers/getOptionKey";
import { toast } from "@/helpers/toast";
import usePlaylistActions from "@/hooks/features/playlist/usePlaylistActions";
import { albumTracksService } from "@/services/deezer";
import { selectTracksForAlbum } from "@/store/album/album.selector";
import { setAlbumSongs, upsertOneAlbum } from "@/store/album/albumSlice";
import { selectCollectionById, selectPlaylistSongs } from "@/store/playlist/playlist.selector";
import { selectGlobalSuggestionSong, selectLikedSong } from "@/store/songs/songs.selector";
import { upsertManyToCatalog } from "@/store/songs/songsSlice";
import { RootState } from "@/store/store";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function PlaylistPage() {

    const [loading, setLoading] = useState(false);

    const sugestionFromPlaylist = usePlaylistActions().sugestionFromPlaylist;

    const dispatch = useDispatch()
    const router = useRouter()
    const params = useSearchParams();

    const playlistId = params.get("list");

    const suggestionSongs = useSelector(selectGlobalSuggestionSong);

    const collection = useSelector((state: RootState) =>
        selectCollectionById(state, playlistId || "")
    );

    const playlistSongs = useSelector((state: RootState) => {
        if (!playlistId || !collection) return [];

        switch (collection.type) {
            case "liked":
                return selectLikedSong(state)
            case "playlist":
                return selectPlaylistSongs(playlistId || "")(state);
            case "album":
                return selectTracksForAlbum(state, playlistId)
            default:
                return []
        }
    });

    const album = useSelector((state: RootState) => {
        if (!playlistId) return;
        return state.album.catalog.entities[playlistId]
    });

    const isLocalPlaylist = useSelector((state: RootState) =>
        playlistId ? state.playlist.playlists.find(pl => pl.id === playlistId) : false
    );

    useEffect(() => {
        if (!playlistId) return;

        if (playlistId === "LM") return;

        if (isLocalPlaylist) return;

        if (album?.songIds) return;

        const fetchAlbumTracks = async () => {

            try {
                setLoading(true)

                if (!album?.songIds) {
                    const data = await albumTracksService(playlistId)

                    const { album, tracks } = data;

                    const albumTracksIds = tracks.map(song => song.id);

                    const songsWithAlbumData = tracks.map(song => ({
                        ...song,
                        albumId: playlistId,
                        cover: album.cover[0]
                    }));

                    dispatch(upsertOneAlbum(album));
                    dispatch(setAlbumSongs({ albumId: playlistId, songIds: albumTracksIds }));
                    dispatch(upsertManyToCatalog(songsWithAlbumData));
                }
            } catch (error) {

                if (axios.isAxiosError(error)) {
                    const status = error.response?.status;

                    if (status === 500) {
                        toast("Error del servidor", "Reintente nuevamente")
                    }
                }
            } finally {
                setLoading(false)
            }
        };

        fetchAlbumTracks();

    }, [playlistId, dispatch, album, isLocalPlaylist]);

    useEffect(() => {
        if (!playlistId) return;
        sugestionFromPlaylist(playlistId)
        console.log("playlistpage suggestion")
    }, [playlistId, sugestionFromPlaylist])


    if (!playlistId || !collection) return (
        <div className="flex gap-x-2">
            <span>No se encontró playlist: </span>
            <button onClick={() => router.replace("/")} className="underline cursor-pointer"> Regresar</button>
        </div>
    )

    return (
        <>
            {!loading ? (
                <div className="flex flex-col justify-around gap-x-10 lg:flex-row w-full">
                    <PlaylistCover
                        collection={collection}
                        playlistId={playlistId}
                        album={album}
                        type={collection.type}
                    />

                    <div className="flex flex-col gap-y-6 lg:w-full">
                        <div className="flex flex-col gap-y-6">
                            {!playlistSongs.length ? (
                                <span className="py-10 text-center text-neutral-400">
                                    No has guardado nada (aún)
                                </span>
                            ) : (
                                playlistSongs.map(track => {
                                    const option = getOptionKey("song", track.id)

                                    return (
                                        <SongCard
                                            playlistId={playlistId}
                                            key={track.id}
                                            song={track}
                                            view="playlist"
                                            mode={collection.type}
                                            optionKey={option}
                                        />
                                    )
                                }))
                            }
                        </div>

                        {collection.type === "playlist" && (
                            <div>
                                <h3 className="text-2xl font-semibold">Sugerencias</h3>
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
