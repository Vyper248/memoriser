import { useEffect } from "react";

export const useEnterListener = (id: string, callback: ()=>void) => {
    useEffect(() => {
        let input = document.getElementById(id);

        const keypressListener = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                callback();
            }
        }

        input?.addEventListener('keypress', keypressListener);

        return () => {
            input?.removeEventListener('keypress', keypressListener);
        }
    }, [id, callback]);
}