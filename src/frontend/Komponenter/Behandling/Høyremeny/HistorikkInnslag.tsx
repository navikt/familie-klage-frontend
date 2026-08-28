import { PersonCircleIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Detail, HStack, Label } from '@navikt/ds-react';
import * as React from 'react';
import type { Behandling } from '../../../App/typer/fagsak';
import {
    behandlingStegFullførtTilTekst,
    hendelseHistorikkTilTekst,
    StegType,
} from '../../../App/typer/fagsak';
import { formaterIsoDatoTid } from '../../../App/utils/formatter';
import { utledStegutfallForFerdigstiltBehandling } from '../utils';
import type { IBehandlingshistorikk } from './behandlingshistorikk';
import styles from './HistorikkInnslag.module.css';

interface Props {
    behandling: Behandling;
    historikkInnslag: IBehandlingshistorikk;
}

export const HistorikkInnslag: React.FC<Props> = ({ behandling, historikkInnslag }) => {
    const { steg, historikkHendelse, beskrivelse, opprettetAv, endretTid } = historikkInnslag;

    const labelTekst = historikkHendelse
        ? hendelseHistorikkTilTekst[historikkHendelse]
        : behandlingStegFullførtTilTekst[steg];

    return (
        <HStack margin="space-24">
            <div>
                <PersonCircleIcon fontSize="1.5rem" height={'1em'} />
                <div className={styles.stipletLinje} />
            </div>
            <Box marginInline="space-8 space-0">
                <Label size="small">{labelTekst}</Label>
                {beskrivelse && (
                    <BodyShort className={styles.beskrivelse} size="small">
                        {beskrivelse}
                    </BodyShort>
                )}
                {steg === StegType.BEHANDLING_FERDIGSTILT && (
                    <BodyShort>
                        {utledStegutfallForFerdigstiltBehandling(behandling, steg)}
                    </BodyShort>
                )}
                <Detail>
                    {formaterIsoDatoTid(endretTid)} | {opprettetAv}
                </Detail>
            </Box>
        </HStack>
    );
};
