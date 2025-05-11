import { useEffect } from 'react';
import { erProd } from '../utils/miljø';
import { Fagsystem } from '../typer/fagsak';

const baksSporingskodeDev = '247e688e-fb49-41f5-a1ab-6ba59e71ea30';
const baksSporingskodeProd = '';

const sporingskodeForMiljøOgFagsystem = (fagsystem: Fagsystem) => {
    if (fagsystem === Fagsystem.EF) {
        return;
    }
    return erProd() ? baksSporingskodeProd : baksSporingskodeDev;
};

export const useStartUmami = (fagsystem: Fagsystem) => {
    useEffect(() => {
        const websiteId = sporingskodeForMiljøOgFagsystem(fagsystem);
        if (!websiteId) {
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.nav.no/team-researchops/sporing/sporing.js';
        script.defer = true;
        script.setAttribute('data-host-url', 'https://umami.nav.no');
        script.setAttribute('data-website-id', websiteId);

        document.body.appendChild(script);

        return () => {
            try {
                document.body.removeChild(script);
            } catch {
                /* empty */
            }
        };
    }, [fagsystem]);
};
