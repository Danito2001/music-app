import { useState } from "react";

type UsePlaylistReturn<T> = {
    playlists: T[];
    createPlaylist: (playlist: T) => void;
    updatePlaylist: (id: string, data: Partial<T>) => void;
    deletePlaylist: (id: string) => void;
};

export function usePlaylist<T extends { id: string }>(initialValues: T[] = []): UsePlaylistReturn<T> {

    const [ playlists, setPlaylists ] = useState<T[]>(initialValues)

    const createPlaylist = (item: T) => setPlaylists(prev => [...prev, item])

    const updatePlaylist = (id: string) => {
        setPlaylists(prev => prev.map(item => item.id === id ? { ...item, id } : item))
    }

    const deletePlaylist = (id: string) => {
        setPlaylists(prev => prev.filter(item => item.id !== id));
    };


    return {
        playlists,
        createPlaylist,
        updatePlaylist,
        deletePlaylist
    };
}