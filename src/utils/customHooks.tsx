import { useEffect, useRef } from "react";
import { Card } from "../types";

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
    }, [open, callback]);

    return ref;
}

export const useResizeListener = (callback: ()=>void, time: number) => {
    useEffect(() => {
        let timeout = null as NodeJS.Timeout | null;

        let resizeListener = () => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(callback, time);
        }
        
        window.addEventListener('resize', resizeListener);

        return () => {
            window.removeEventListener('resize', resizeListener);
        }
    }, [callback, time]);
}

export const useScrollListener = (callback: ()=>void) => {
    useEffect(() => {
        let scrollEvent = () => {
            callback();
        };

        document.addEventListener('scroll', scrollEvent);

        return () => document.removeEventListener('scroll', scrollEvent);
    }, [callback]);
}

export const useKeyboardControls = (first: boolean, flippedCard: Card | null, flipped: boolean, editMode: boolean, flipCard: ()=>void, onClickCorrect: ()=>void, onClickIncorrect: ()=>void) => {
    useEffect(() => {
        if (first && flippedCard === null) {
            let listener = (e: KeyboardEvent) => {
                if (e.key === 'Enter' && flipped === false) {
                    flipCard();
                }
            }

            window.addEventListener('keypress', listener);

            return () => {
                window.removeEventListener('keypress', listener);
            }
        } else if (flipped) {
            let listener = (e: KeyboardEvent) => {
                if ((e.key === 'Enter' || e.key === 'c' || e.key === 'y') && flipped === true) {
                    if (!editMode) onClickCorrect();
                } else if ((e.key === 'i' || e.key === 'n') && flipped === true) {
                    if (!editMode) onClickIncorrect();
                }
            }

            window.addEventListener('keypress', listener);

            return () => {
                window.removeEventListener('keypress', listener);
            }
        }
    }, [first, flipped, flippedCard, flipCard, onClickCorrect, onClickIncorrect]);
}