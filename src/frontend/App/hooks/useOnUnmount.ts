import { useEffect, useRef } from 'react';

export function useOnUnmount(callback: () => void) {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;
    useEffect(
        () => () => {
            callbackRef.current();
        },
        []
    );
}
