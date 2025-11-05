import { useState, useCallback, useEffect } from "react";

export default function useCopyToClipboard(timeout = 1200) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
    } catch (error) {
      console.error("Error al copiar al portapapeles:", error);
      setIsCopied(false);
    }
  }, []);

  // Usamos useEffect para resetear el estado 'isCopied' después del timeout
  useEffect(() => {
    let timerId = null;

    if (isCopied) {
      timerId = setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    }

    // Función de limpieza: se ejecuta si el componente se desmonta
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [isCopied, timeout]);

  return { isCopied, copy };
}
