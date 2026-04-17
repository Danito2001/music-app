import { useLockScroll } from "@/hooks/common/useLockScroll";
import { createContext, useContext, useMemo, useState } from "react";

interface OptionsContextType {
	optionsOpen: string | null;
	toggleOptions: (key: string) => void;
	closeOptions: () => void;
}

const OptionsContext = createContext<OptionsContextType | undefined>(undefined);

export function OptionProvider({ children }: { children: React.ReactNode }) {

    const [ optionsOpen, setOptionsOpen ] = useState<string | null>(null);

    const value = useMemo(() => ({
		optionsOpen,
		toggleOptions: (key: string) => setOptionsOpen(prev => (prev === key ? null : key)),
		closeOptions: () => setOptionsOpen(null),
	}), [optionsOpen]);

	useLockScroll(!!optionsOpen)

    return <OptionsContext.Provider value={value}>{children}</OptionsContext.Provider>;
}

export const useOptions = () => {
	const context = useContext(OptionsContext);
	if (!context) throw new Error("useOptions debe usarse dentro de OptionsProvider");
	return context;
};