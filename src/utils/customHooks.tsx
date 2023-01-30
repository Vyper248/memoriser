import React, { useEffect, useRef } from "react";

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

export const useClickOutside = <T extends HTMLElement>(callback: ()=>void, open: boolean) => {
    const ref = useRef<T>(null);

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            let target = e.target as Node;
            if (ref.current && !ref.current.contains(target)) {
                if (open) callback();
            }
        }

        document.addEventListener('click', onClickOutside);
        return () => {
            document.removeEventListener('click', onClickOutside);
        }
    }, [open]);

    return ref;
}