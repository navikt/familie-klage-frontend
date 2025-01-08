import { useEffect, useRef } from 'react';

export function useOnMount(onMount: () => void) {
    const isMountedRef = useRef(false);
    useEffect(() => {
        if (!isMountedRef.current) {
            onMount();
            isMountedRef.current = true;
        }
    });
}
