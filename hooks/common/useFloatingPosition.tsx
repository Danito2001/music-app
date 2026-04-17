import { useOptions } from "@/context/option.context";
import { useRef, useState } from "react"

export const useFloatingPosition = () => {

    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const { toggleOptions, optionsOpen, closeOptions } = useOptions();
    
    const [ position, setPosition ] = useState({ top: 0, left: 0});

    const handleOptionSelect = (action: () => void) => {
        action()
        closeOptions()
    }

    const handleOpen = (key: string) => {
        const isOpening = optionsOpen !== key

        if (isOpening && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();

            const menuRect = menuRef.current?.getBoundingClientRect();
            const height = menuRect?.height ?? 250;

            let left = rect.left
            let top = rect.bottom;

            if (left + 250 > window.innerWidth) {
                left = rect.right - 250
            }

            if (rect.bottom + height > window.innerHeight) {
                top = rect.top - height;
            }

            setPosition({
                top,
                left
            });
        }

        toggleOptions(key)
    };

    return {
        buttonRef,
        menuRef,
        position,
        optionsOpen,
        handleOptionSelect,
        handleOpen,
        closeOptions
    }
}