"use client";

import { Privacity } from "@/interfaces/common.interface";
import { useContext, useMemo, useState, createContext } from "react";

interface PlaylistToEdit {
	playlistId: string;
	title: string;
	description: string
	privacity: Privacity;
} 

interface SaveModal {
	songId?: string;
	songIds?: string[];
}

type ModalType = 
	| { type: "playlistSelect"}
	| { type: "saveSong", props: SaveModal }
	| { type: "config"}
	| { type: "playlistForm", props?: Partial<PlaylistToEdit> }

interface UIContextType {
	sidebarOpen: boolean;
	searchOpen: boolean;
	playerOpen: boolean;
	activeModal: ModalType | null;
	color: string;
	toggleSidebar: () => void;
	toggleSearch: () => void;
	closeSearch: () => void;
	togglePlayer: () => void;
	modalOpen: (modal: ModalType) => void;
	closeModal: () => void;
	closePlayer: () => void;
	setColor: (value: string) => void;
}
 
const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {

	const [ sidebarOpen, setSidebarOpen ] = useState(true);
	const [ activeModal, setActiveModal ] = useState<ModalType | null>(null);
	const [ searchOpen, setSearchOpen ] = useState(false);
	const [ playerOpen, setPlayerOpen ] = useState(false);
	const [ color, setColor ] = useState("");

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

	const value = useMemo(() => ({
		sidebarOpen,
		activeModal,
		searchOpen,
		playerOpen,
		color,
		toggleSidebar: () => setSidebarOpen(prev => !prev),
		togglePlayer: () => setPlayerOpen(prev => !prev),
		toggleSearch: () => setSearchOpen(prev => !prev),
		closeSearch: () => setSearchOpen(false),
		closePlayer: () => setPlayerOpen(false),
		modalOpen: (modal: ModalType | null) => setActiveModal(modal),
		closeModal: () => setActiveModal(null),
		setColor: (value: string) => setColor(value),
		isMobile
	}), [sidebarOpen, activeModal, playerOpen, searchOpen, color, isMobile])


	return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUIContext() {
	const context = useContext(UIContext);
	if (!context) {
		throw new Error('useUIContext debe usarse dentro de un <UIProvider>');
	}
	return context;
}


