import { toast } from "@/helpers/toast";
import { albumTracksService } from "@/services/deezer";
import { selectTracksForAlbum } from "@/store/album/album.selector";
import { setAlbumSongs, upsertOneAlbum } from "@/store/album/album.slice";
import { upsertManyToCatalog } from "@/store/songs/songs.slice";
import { RootState } from "@/store/store";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


export const useAlbumSongs = (albumId: string | null) => {

    const dispatch = useDispatch();
    const [ loading, setLoading ] = useState(false);

    const album = useSelector((state: RootState) =>
        albumId ? state.album.catalog.entities[albumId] : undefined
    );

    const songs = useSelector((state: RootState) =>
        selectTracksForAlbum(state, albumId)
    );

    useEffect(() => {
            if (!albumId) return;
    
            if (album?.songIds) return;
    
            const fetchAlbumTracks = async () => {
    
                try {
                    setLoading(true)
    
                    if (!album?.songIds) {
                        const data = await albumTracksService(albumId)
    
                        const { album, tracks } = data;
    
                        const albumTracksIds = tracks.map(song => song.id);
    
                        const songsWithAlbumData = tracks.map(song => ({
                            ...song,
                            albumId,
                            cover: album.cover[0]
                        }));
    
                        dispatch(upsertOneAlbum(album));
                        dispatch(setAlbumSongs({ albumId, songIds: albumTracksIds }));
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
    
        }, [albumId, dispatch, album]);

    return {
        album,
        loading,
        songs
    }
}