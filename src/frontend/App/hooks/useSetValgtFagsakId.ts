import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const useSetValgtFagsakId = (fagsakId: string) => {
    const { settValgtFagsakId } = useApp();

    useEffect(() => {
        settValgtFagsakId(fagsakId);
        return () => settValgtFagsakId(undefined);
    }, [settValgtFagsakId, fagsakId]);

    return {};
};
