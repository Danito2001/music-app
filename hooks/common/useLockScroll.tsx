import { useEffect } from "react"

export const useLockScroll = (active: boolean) => {

    useEffect(() => {
        document.body.style.overflow = active ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [active])

}