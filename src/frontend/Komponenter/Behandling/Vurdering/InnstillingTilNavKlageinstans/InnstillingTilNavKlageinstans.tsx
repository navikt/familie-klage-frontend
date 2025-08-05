import { EnsligTextArea } from '../../../../Felles/Input/EnsligTextArea';
import * as React from 'react';
import { IVurdering } from '../vurderingValg';
import { LesMerOmInnstilling } from './LesMerOmInnstilling';
import { Box } from '@navikt/ds-react';

interface Props {
    oppdatertVurdering: IVurdering;
    settIkkePersistertKomponent: (verdi: string) => void;
    settOppdatertVurdering: (vurdering: React.SetStateAction<IVurdering>) => void;
    settVurderingEndret: (endret: boolean) => void;
}

export const InnstillingTilNavKlageinstans: React.FC<Props> = ({
    oppdatertVurdering,
    settIkkePersistertKomponent,
    settOppdatertVurdering,
    settVurderingEndret,
}) => (
    <Box>
        <EnsligTextArea
            label="Innstilling til Nav Klageinstans (kommer med i brev til bruker)"
            value={oppdatertVurdering.innstillingKlageinstans}
            onChange={(e) => {
                settIkkePersistertKomponent(e.target.value);
                settOppdatertVurdering((tidligereTilstand) => ({
                    ...tidligereTilstand,
                    innstillingKlageinstans: e.target.value,
                }));
                settVurderingEndret(true);
            }}
            size="medium"
            readOnly={false}
        />
        <LesMerOmInnstilling />
    </Box>
);
