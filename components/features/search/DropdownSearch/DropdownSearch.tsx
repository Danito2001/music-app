import { Button } from "@heroui/react"
import { ArtistCard } from "../../song/ArtistCard"
import { SongCard } from "../../song/SongCard"
import { Icons } from "@/icons"
import { MdHistory } from "react-icons/md"
import Link from "next/link"
import { SearchProps } from "@/interfaces/ui.interface"
import { useSelector } from "react-redux"
import { selectSearchSong } from "@/store/songs/songs.selector"
import { selectSearchArtist } from "@/store/artist/artist.selector"
import { SetStateAction } from "react"
import { getOptionKey } from "@/helpers/getOptionKey"

type DropdownProps = {
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    recentSearch: SearchProps[];
    setRecentSearch: React.Dispatch<SetStateAction<SearchProps[]>>
}

export default function DropdownSearch({
    dropdownRef,
    recentSearch,
    setRecentSearch
}: DropdownProps) {

    const searchSongs = useSelector(selectSearchSong)
    const searchArtist = useSelector(selectSearchArtist)

    const deleteRecentSearch = (searchId: string) => setRecentSearch(prev => prev.filter(item => item.id !== searchId))

    return (
        <div
            ref={dropdownRef}
            className="absolute top-12 right-0 w-full rounded-xl p-2 max-h-[420px] overflow-y-auto border border-white/20 text-white/50 bg-primary z-50"
        >
            {recentSearch.map((item) => (
                <div
                    key={item.id}
                    className="flex justify-between items-center mb-4 hover:bg-white/10"
                >
                    <Link href={`/search?q=${encodeURIComponent(item.value)}`}>
                        <div className="flex items-center gap-x-2 px-2">
                            <MdHistory size={22} />
                            <span>{item.value}</span>
                        </div>
                    </Link>

                    <Button onMouseDown={(e) => {
                        e.preventDefault()
                        deleteRecentSearch(item.id)
                    }}>
                        <Icons.Trash size={18} />
                    </Button>
                </div>
            ))}

            {searchSongs.map((track) => {
                const option = getOptionKey("song", track.id)

                return (
                    <SongCard
                        key={track.id}
                        playlistId={null}
                        song={track}
                        view="search"
                        mode="suggestion-standalone"
                        optionKey={option}
                    />
                )
            })}

            {searchArtist && <ArtistCard artist={searchArtist} />}
        </div>
    )
}