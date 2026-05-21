import { Option } from "@/interfaces/ui.interface";
import { Button } from "@heroui/react";
import React from "react";
import { createPortal } from "react-dom";

interface OptionsMenuProps {
    open: boolean;
    options: Option[];
    onSelect: (option: Option) => void;
    position: { top: number; left: number; } | null;
    optionRef: React.RefObject<HTMLDivElement | null>
}


export default function PlaybackOptions({ open, options, onSelect, position, optionRef }: OptionsMenuProps) {
    if (!open || !position) return null;

    return (
        createPortal(
            <div ref={optionRef} 
            style={{
                position: "fixed",
                top: position.top,
                left: position.left
            }} 
            className="absolute z-50 flex flex-col overflow-y-auto overflow-x-hidden border border-neutral-700 bg-neutral-800 h-auto w-[250px]">
                {options.map((opt) => (
                    <Button
                        key={opt.label}
                        onPress={() => onSelect(opt)}
                        className="flex justify-start items-center w-full p-4 hover:bg-neutral-700 text-start text-xs text-white"
                        startContent={<opt.icon size={18}/>}
                    >
                        {opt.label}
                    </Button>
                ))}
            </div>, document.body
        )
    );
}
