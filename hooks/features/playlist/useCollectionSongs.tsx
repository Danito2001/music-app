import { selectLikedSong } from "@/store/songs/songs.selector";
import { useAlbumSongs } from "./useAlbumSongs";
import { useSelector } from "react-redux";
import { UiAlbum, UiSong } from "@/interfaces/song.interface";
import { CollectionType } from "./useCollectionType";
import { selectPlaylistSongs } from "@/store/playlist/playlist.selector";
import { RootState } from "@/store/store";
import { useArtistSongs } from "./useArtistSongs";

type UseCollectionSongsReturn = {
    songs: UiSong[];
    loading: boolean;
    album?: UiAlbum;
};

export const useCollectionSongs = (
    id: string | null,
    type: CollectionType | null
): UseCollectionSongsReturn => {

    const likedSongs = useSelector(selectLikedSong);
    
    const playlistSongs = useSelector((state: RootState) => 
        selectPlaylistSongs(state, id)
    )

    const album = useAlbumSongs(
        type === "album" ? id : null
    );

    const artist = useArtistSongs(
        type === "artist" ? id : null,
        20
    );

    switch (type) {
        case "liked":
            return { songs: likedSongs, loading: false };

        case "playlist":
            return { songs: playlistSongs, loading: false };

        case "album":
            return { songs: album.songs, album: album.album, loading: album.loading };

        case "artist": 
            return { songs: artist.songs, loading: artist.loading };

        default:
            return { songs: [], loading: false };
    }
};