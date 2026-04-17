import { useEffect, useState } from "react";


export const useScrolled = () => {
    
    const [ scrolled, setScrolled ] = useState(false);

    useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY > 1
			setScrolled(prev => {
				if (prev === scrollY) return prev;
				return scrollY; 
			})

		}

		window.addEventListener("scroll", handleScroll)
		
		return () => {
			window.removeEventListener("scroll", handleScroll)
		}
	}, [])

    return scrolled
}
