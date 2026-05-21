import { Button, Input } from "@heroui/react";
import UserProfile from "../UserProfile/UserProfile";
import Image from "next/image";
import { useUIContext } from "@/context/ui.context";
import { useState, useEffect, useRef } from "react";
import { Icons } from "@/icons";
import { CiSearch } from "react-icons/ci";
import { usePathname, useRouter } from "next/navigation";
import { nanoid } from "@reduxjs/toolkit";
import { searchTracks } from "@/store/songs/songs.thunk";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import classNames from "classnames";
import { useScrolled } from "@/hooks/common/useScrolled";
import { DropdownSearch } from "@/components/features/search/DropdownSearch";
import { SearchProps } from "@/interfaces/ui.interface";


export default function Navbar() {

    const [ isActive, setIsActive ] = useState(false);
    const [ search, setSearch ] = useState("");
    const [ recentSearch, setRecentSearch ] = useState<SearchProps[]>([]);

    const { searchOpen, toggleSearch, sidebarOpen, toggleSidebar, playerOpen } = useUIContext();
    const scrolled = useScrolled();
    const pathname = usePathname();

    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!search.trim()) return;

        const timeout = setTimeout(() => {
            dispatch(searchTracks(search))
        }, 200);

        return () => clearTimeout(timeout)

    }, [search, dispatch])

    useEffect(() => {
        setIsActive(false)
    }, [pathname])
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    const handleSelect = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && search.trim() !== "") {

            e.currentTarget.blur()

            setRecentSearch(prev => {
                const filtered = prev.filter(item => item.value !== search)
                const newSearch: SearchProps = {
                    id: nanoid(),
                    value: search
                }
                return [newSearch, ...filtered].slice(0, 6)
            })
            setSearch("");
            setIsActive(false);
            router.push(`/search?q=${encodeURIComponent(search)}&limit=10`);
        }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const nextFocus = e.relatedTarget as Node | null;

        if (dropdownRef.current?.contains(nextFocus)) {
            return;
        }
        setIsActive(false);
    };

    return (
        <nav className={classNames("sticky top-0 flex z-40 px-6 py-2 mb-8 w-full h-15",
            playerOpen
                ? "bg-primary border-b border-b-white/10"
                : scrolled ? "bg-primary border-b border-b-white/10" : "bg-transparent border-none",
        )}>
            <div className={`flex items-center justify-between w-full text-white`}>

                {/* button bar and YT icon */}
                <div className="relative flex items-center gap-x-16 w-full">
                    <div className="flex gap-x-2">
                        <Button
                            onPress={toggleSidebar}
                            isIconOnly
                            className={`${!sidebarOpen ? "mx-auto" : ""} hover:bg-white/10 rounded-full`}
                        >
                            <Icons.Bars size={18} className="mx-auto" />
                        </Button>
                        <div onClick={() => router.push("/")} className="flex items-center gap-x-1 cursor-pointer">
                            <Image
                                src="https://upload.wikimedia.org/wikipedia/commons/6/6a/Youtube_Music_icon.svg"
                                alt="YouTube Music"
                                width={26}
                                height={26}
                            />
                            <h2 className="text-xl">Music</h2>
                        </div>
                    </div>

                    {/* responsive inputs */}
                    <div className="hidden md:block w-full max-w-100">
                        <div className="relative">
                            <Input
                                placeholder="Buscar canciones o artistas"
                                classNames={{ 
                                    input: "p-2 rounded-lg focus:bg-black/90 bg-white/10 border border-white/10 text-sm text-white placeholder:text-white/80",
                                }}
                                onFocus={() => setIsActive(true)}
                                onBlur={handleBlur}
                                value={search}
                                onChange={handleChange}
                                onKeyDown={handleSelect}
                            />

                            {isActive && (
                                <DropdownSearch
                                    dropdownRef={dropdownRef}
                                    recentSearch={recentSearch}
                                    setRecentSearch={setRecentSearch}
                                    setIsActive={setIsActive}
                                    isActive={isActive}
                                />
                            )}
                        </div>
                    </div>

                    {searchOpen && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-50 w-full max-w-[400px] md:hidden">
                            <div className="w-full max-w-[400px] relative">
                                <Input
                                    placeholder="Buscar canciones o artistas"
                                    classNames={{ input: "p-2 rounded-lg focus:bg-black/90 bg-black border border-white/10", }}
                                    onFocus={() => setIsActive(true)}
                                    onBlur={handleBlur}
                                    value={search}
                                    onChange={handleChange}
                                    onKeyDown={handleSelect}
                                />

                                {isActive && (
                                    <DropdownSearch
                                        dropdownRef={dropdownRef}
                                        recentSearch={recentSearch}
                                        setRecentSearch={setRecentSearch}
                                        setIsActive={setIsActive}
                                        isActive={isActive}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                </div>
                <div className="flex items-center">
                    <Button
                        isIconOnly
                        onPress={toggleSearch}
                        className="block md:hidden"
                    >
                        <CiSearch size={25} />
                    </Button>
                    <UserProfile />
                </div>
            </div>
        </nav>
    )
}