import { getTracksService } from "@/services/deezer";
import { selectSongsByArtistId } from "@/store/artist/artist.selector";
import { upsertManyToCatalog } from "@/store/songs/songs.slice";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


export const useArtistSongs = (artistId: string | null, limit = 20) => {

    const [ loading, setLoading ] = useState(false);

    const dispatch = useDispatch()

    const songs = useSelector((state: RootState) => 
        selectSongsByArtistId(state, artistId)
    );

    useEffect(() => {
        if (!artistId) return;

        const fetch = async () => {
            try {
                setLoading(true);
                
                const data = await getTracksService(artistId, limit);
                dispatch(upsertManyToCatalog(data))
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [artistId, limit]);

    return { songs, loading };
};