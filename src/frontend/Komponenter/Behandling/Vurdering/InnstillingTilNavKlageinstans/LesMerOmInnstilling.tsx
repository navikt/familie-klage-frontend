import * as React from 'react';
import { Box, ReadMore } from '@navikt/ds-react';

export const LesMerOmInnstilling = () => {
    return (
        <Box maxWidth="40rem" marginBlock="2 0">
            <ReadMore size="small" header="Dette skal innstillingen inneholde">
                <ol>
                    <li>
                        Hva klagesaken gjelder
                        <ol type="a">
                            <li>
                                Skriv kort om resultatet i vedtaket. Eksempel: Klagers søknad om
                                overgangsstønad ble avslått fordi hun har fått nytt barn med samme
                                partner.
                            </li>
                        </ol>
                    </li>
                    <li>
                        Vurdering av klagen
                        <ol type="a">
                            <li>Begrunn hvorfor vi opprettholder vedtaket</li>
                            <li>Klagers argumenter skal vurderes/kommenteres</li>
                            <li>Avslutt med konklusjon og vis til hjemmel</li>
                        </ol>
                    </li>
                </ol>
            </ReadMore>
        </Box>
    );
};
