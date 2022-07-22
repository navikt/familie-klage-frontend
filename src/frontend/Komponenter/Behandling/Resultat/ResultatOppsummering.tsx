import * as React from 'react';
import { useState } from 'react';
import { Heading } from '@navikt/ds-react';
import { Ikon } from '../Vurdering/Ikon';
import { Behandling } from '../../../App/typer/fagsak';

export enum Resultater {
    IKKE_VURDERT = 'IKKE_VURDERT',
    FORMKRAV_IKKE_OPPFYLT = 'FORMKRAV_IKKE_OPPFYLT',
    TATT_TIL_FØLGE = 'TATT_TIL_FØLGE',
    KLAGEINSTANSEN_AVVENTER_SVAR = 'KLAGEINSTANSEN_AVVENTER_SVAR',
    KLAGEINSTANSEN_TATT_TIL_FØLGE = 'KLAGEINSTANSEN_TATT_TIL_FØLGE',
    KLAGEINSTANSEN_VEDTAK_STÅENDE = 'KLAGEINSTANSEN_VEDTAK_STÅENDE',
}

export const resultatTilTekst: Record<Resultater, string> = {
    IKKE_VURDERT: 'Klagen er ikke vurdert enda.',
    FORMKRAV_IKKE_OPPFYLT: 'Formkravene er ikke oppfylt og vedtak består.',
    TATT_TIL_FØLGE: 'Klagen er tatt til følge og vedtak blit omgjort.',
    KLAGEINSTANSEN_AVVENTER_SVAR:
        'Saksbehandler har vurdert vedtaket til å bestå og klagen er sendt videre til klageinstansen.',
    KLAGEINSTANSEN_TATT_TIL_FØLGE:
        'Klageinstansen har tatt klagen til følge og vedtak blit omgjort.',
    KLAGEINSTANSEN_VEDTAK_STÅENDE: 'Klageinstansen har avslått klagen og vedtak består.',
};

interface IResultat {
    behandling: Behandling;
}

export const ResultatOppsummering: React.FC<IResultat> = ({ behandling }) => {
    const [resultat, settResultat] = useState<Resultater>(Resultater.IKKE_VURDERT);

    return (
        <div>
            <Heading spacing size="large" level="5">
                Resultat
            </Heading>
            {(resultat == Resultater.KLAGEINSTANSEN_TATT_TIL_FØLGE ||
                resultat == Resultater.TATT_TIL_FØLGE) && (
                <Ikon>
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0Z"
                        fill="#007C2E"
                    ></path>
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="m17.047 7.671 1.399 1.43-8.728 8.398L6 14.02l1.395-1.434 2.319 2.118 7.333-7.032Z"
                        fill="#fff"
                    ></path>
                </Ikon>
            )}
            {(resultat == Resultater.FORMKRAV_IKKE_OPPFYLT ||
                resultat == Resultater.KLAGEINSTANSEN_VEDTAK_STÅENDE) && (
                <Ikon>
                    <path
                        d="M11.999 0C5.395 0 .013 5.372 0 11.976a11.923 11.923 0 0 0 3.498 8.493A11.925 11.925 0 0 0 11.977 24H12c6.603 0 11.986-5.373 12-11.978C24.012 5.406 18.64.012 11.999 0Z"
                        fill="#BA3A26"
                    ></path>
                    <path
                        d="m12 10.651 3.372-3.372a.954.954 0 1 1 1.349 1.35L13.349 12l3.372 3.372a.954.954 0 1 1-1.35 1.349L12 13.349 8.628 16.72a.954.954 0 1 1-1.349-1.35L10.651 12 7.28 8.628A.954.954 0 1 1 8.63 7.28L12 10.651Z"
                        fill="#fff"
                    ></path>
                </Ikon>
            )}
            {(resultat == Resultater.IKKE_VURDERT ||
                resultat == Resultater.KLAGEINSTANSEN_AVVENTER_SVAR) && (
                <Ikon>
                    <path
                        d="M11.126.564a.962.962 0 0 1 1.741-.021l11.011 21.912c.358.695-.117 1.54-.865 1.54H.987c-.738 0-1.215-.826-.876-1.519L11.126.564Z"
                        fill="#D47B00"
                    ></path>
                    <path d="M11 7.996h2v7h-2v-7Z" fill="#fff"></path>
                    <circle cx="12" cy="18.496" r="1.5" fill="#fff"></circle>
                </Ikon>
            )}
            {resultatTilTekst[resultat]}
        </div>
    );
};
