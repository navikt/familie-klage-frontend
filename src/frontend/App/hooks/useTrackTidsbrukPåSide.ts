import { useEffect } from 'react';
import { Behandling } from '../typer/fagsak';
import { sendTilUmami } from '../utils/umami';

export const hentSideHref = (pathname: string) => pathname.split('/')[4];

export const useTrackTidsbrukPåSide = (behandling: Behandling) => {
    const sidevisning = hentSideHref(location.pathname);

    useEffect(() => {
        const startTid = new Date();
        return () => {
            const sluttTid = new Date();
            const intervallISekunder = (sluttTid.getTime() - startTid.getTime()) / 1000;

            // Gjør ingenting med svært korte intervaller. De er sannsynligvis på grunn av
            // re-renders av samme komponent eller strict mode i localhost
            if (intervallISekunder < 0.1) {
                return;
            }

            // TODO: Finn ut hvilken data vi vil spore.
            const data = {
                behandlingId: behandling.id,
                fagsakId: behandling.fagsakId,
                steg: behandling.steg,
                årsak: behandling.årsak,
                behandlingStatus: behandling.status,
                resultat: behandling.resultat,
                stønadstype: behandling.stønadstype,
                // klageinstansResultat?
                // påklagetVedtak?
                // eksternFagsystemFagsakId?
                fagsystem: behandling.fagsystem,
                // klageMottatt: behandling.klageMottatt,
                // fagsystemRevurdering?

                // sideId: sideId,
                startTid: startTid,
                sluttTid: sluttTid,
                intervallISekunder: intervallISekunder,
            };

            sendTilUmami('sidevisning_i_behandling', data);
        };
        // TODO: Spør om dependencies
    }, [sidevisning, behandling]);
};
