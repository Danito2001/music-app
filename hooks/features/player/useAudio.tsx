import React, { useState } from "react";


export const useAudio = (audioRef: React.RefObject<HTMLAudioElement | null >) => {

    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

    const handleLoadStart = () => {
        setLoading(true);
        setError(null);
    };

    const handleCanPlay = () => {
        setLoading(false);
    };

    const handleError = () => {
        if (!audioRef?.current) return;

        const err = audioRef.current.error;

        let message = "Error desconocido";

        if (err) {
            switch (err.code) {
                case 1: message = "Carga abortada"; break;
                case 2: message = "Error de red"; break;
                case 3: message = "Error al decodificar"; break;
                case 4: message = "Formato no soportado"; break;
            }
        }

        setError(message);
        setLoading(false);
    };

    return {
        loading,
        error,
        setError,
        handlers: {
            onLoadStart: handleLoadStart,
            onCanPlay: handleCanPlay,
            onError: handleError,
        }
    }
}