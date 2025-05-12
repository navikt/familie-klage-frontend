import { useEffect } from 'react';
import { erProd } from '../utils/miljø';

const sporingskodeDev = '247e688e-fb49-41f5-a1ab-6ba59e71ea30';
const sporingskodeProd = '';

export const useStartUmami = () => {
    useEffect(() => {
        const websiteId = erProd() ? sporingskodeProd : sporingskodeDev;
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
    }, []);
};
