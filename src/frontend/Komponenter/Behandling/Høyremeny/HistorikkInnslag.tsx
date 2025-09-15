import * as React from 'react';
import { BodyShort, Box, Detail, HStack, Label } from '@navikt/ds-react';
import styles from './HistorikkInnslag.module.css';
import { formaterIsoDatoTid } from '../../../App/utils/formatter';
import {
    Behandling,
    behandlingStegFullførtTilTekst,
    hendelseHistorikkTilTekst,
    StegType,
} from '../../../App/typer/fagsak';
import { PersonCircleIcon } from '@navikt/aksel-icons';
import { utledStegutfallForFerdigstiltBehandling } from '../utils';
import { IBehandlingshistorikk } from './behandlingshistorikk';

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
        <HStack margin="6">
            <div>
                <PersonCircleIcon fontSize="1.5rem" height={'1em'} />
                <div className={styles.stipletLinje} />
            </div>
            <Box marginInline="2 0">
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
