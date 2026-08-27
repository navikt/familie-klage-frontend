import type { AxiosResponse } from 'axios';
import axios from 'axios';
import createUseContext from 'constate';
import { useCallback, useEffect, useState } from 'react';
import type { Toggles } from './toggles';

const [TogglesProvider, useToggles] = createUseContext(() => {
    const [toggles, settToggles] = useState<Toggles>({});
    TogglesProvider.displayName = 'TOGGLES_PROVIDER';

    const fetchToggles = useCallback(() => {
        const hentToggles = () => {
            return axios.get(`/familie-klage/api/featuretoggle`, {
                withCredentials: true,
            });
        };

        hentToggles()
            .then((resp: AxiosResponse<Toggles>) => settToggles(resp.data))
            .catch((err: Error) => {
                console.log('Kunne ikke hente toggles, ' + err.message);
            });
    }, []);

    useEffect(() => {
        fetchToggles();
    }, [fetchToggles]);

    return { toggles };
});

export { TogglesProvider, useToggles };
