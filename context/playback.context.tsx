import { PlaybackOptions } from "@/components/features/player/PlaybackOptions";
import { useLockScroll } from "@/hooks/common/useLockScroll";
import { Option } from "@/interfaces/ui.interface";
import { createContext, useContext, useLayoutEffect, useRef, useState } from "react";

export type FloatingOptionsState = {
    isOpen: boolean;
    optionKey: string | null;
    options: Option[];
    position: { top: number; left: number } | null;
};

export type OpenOptionsArgs = {
    anchorEl: HTMLElement;
    optionKey: string;
    options: Option[];
    direction?: "top"
};

export type FloatingOptionsContextType = {
    state: FloatingOptionsState;
    openOptions: (args: OpenOptionsArgs) => void;
    closeOptions: () => void;
    menuRef: React.RefObject<HTMLDivElement | null>,
};

const FloatingOptionsContext = createContext<FloatingOptionsContextType | null>(null);

export function FloatingOptionsProvider({ children }: { children: React.ReactNode }) {
    const menuRef = useRef<HTMLDivElement | null>(null);

    const [state, setState] = useState<FloatingOptionsState>({
        isOpen: false,
        optionKey: null,
        options: [],
        position: null,
    });

    const [anchorData, setAnchorData] = useState<DOMRect | null>(null);

    const openOptions = ({
        anchorEl,
        optionKey,
        options,
    }: OpenOptionsArgs) => {
        setAnchorData(anchorEl.getBoundingClientRect());

        setState({
            isOpen: true,
            optionKey,
            options,
            position: {
                left: 0,
                top: 0,
            },
        });
    };

    useLayoutEffect(() => {
        if (!state.isOpen || !menuRef.current || !anchorData) return;

        const menuHeight = menuRef.current.offsetHeight;
        const menuWidth = menuRef.current.offsetWidth;

        const rect = anchorData;

        let left = rect.left;
        let top = rect.bottom;

        if (left + menuWidth > window.innerWidth) {
            left = rect.right - menuWidth;
        }

    if (rect.bottom + menuHeight > window.innerHeight) {
            top = rect.top - menuHeight;
        }

        setState(prev => ({
            ...prev,
            position: { left, top },
        }));
    }, [state.isOpen, anchorData]);


    const closeOptions = () => {
        setState((prev) => ({ ...prev, isOpen: false }));
    };

    const handleSelect = (option: Option) => {
        option.action?.();
        closeOptions();
    };

    useLockScroll(state.isOpen)

    return (
        <FloatingOptionsContext.Provider
            value={{ state, openOptions, closeOptions, menuRef }}
        >
            {children}

            <PlaybackOptions
                optionRef={menuRef}
                open={state.isOpen}
                options={state.options}
                position={state.position}
                onSelect={handleSelect}
            />
        </FloatingOptionsContext.Provider>
    );
}

export const useFloatingOptions = () => {
    const ctx = useContext(FloatingOptionsContext);
    if (!ctx) {
        throw new Error(
            "useFloatingOptions must be used within FloatingOptionsProvider"
        );
    }
    return ctx;
};