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
import { useClickOutside } from "@/hooks/common/useClickOutside"
import { useFloatingPosition } from "@/hooks/common/useFloatingPosition"

type DropdownProps = {
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    recentSearch: SearchProps[];
    setRecentSearch: React.Dispatch<SetStateAction<SearchProps[]>>;
    setIsActive: (value: boolean) => void;
    isActive: boolean;
}

export default function DropdownSearch({
    dropdownRef,
    recentSearch,
    setRecentSearch,
    setIsActive,
    isActive
}: DropdownProps) {

    const searchSongs = useSelector(selectSearchSong)
    const searchArtist = useSelector(selectSearchArtist)
    const floating = useFloatingPosition();
    

    const deleteRecentSearch = (searchId: string) => setRecentSearch(prev => prev.filter(item => item.id !== searchId))

    useClickOutside(dropdownRef, () => {
        setIsActive(false)
        floating.closeOptions()
    }, isActive)

    return (
        <div
            ref={dropdownRef}
            className="absolute top-12 right-0 w-full rounded-xl p-2 max-h-[420px] overflow-y-auto border border-white/20 text-white/50 bg-primary z-50"
        >
            {recentSearch.map((item) => (
                <div
                    key={item.id}
                    className="flex justify-between items-center mb-4 w-full hover:bg-white/10"
                >
                    <Link
                        href={`/search?q=${encodeURIComponent(item.value)}`}
                        className="flex-1"
                        onClick={() => setIsActive(false)}
                    >
                        <div className="flex items-center gap-x-2 px-2 py-2 w-full">
                            <MdHistory size={22} />
                            <span>{item.value}</span>
                        </div>
                    </Link>

                    <Button
                        onMouseDown={(e) => {
                            e.preventDefault()
                            deleteRecentSearch(item.id)
                        }}
                    >
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