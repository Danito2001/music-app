import { useEffect } from "react";

export function useClickOutside(
    ref: React.RefObject<HTMLDivElement | null>, 
    handler: () => void,
    active: string | null
) {
  useEffect(() => {
    if (!active) return;

    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, active]);
}