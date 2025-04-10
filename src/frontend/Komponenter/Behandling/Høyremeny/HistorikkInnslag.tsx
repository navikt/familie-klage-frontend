import * as React from 'react';
import { ABorderStrong, ASpacing1 } from '@navikt/ds-tokens/dist/tokens';
import { BodyShort, Detail, Label } from '@navikt/ds-react';
import styled from 'styled-components';
import { formaterIsoDatoTid } from '../../../App/utils/formatter';
import {
    Behandling,
    behandlingStegFullførtTilTekst,
    hendelseHistorikkTilTekst,
    HistorikkHendelse,
    StegType,
} from '../../../App/typer/fagsak';
import { PersonCircleIcon } from '@navikt/aksel-icons';
import { utledStegutfallForFerdigstiltBehandling } from '../utils';

const Innslag = styled.div`
    display: flex;
    margin: 1rem 1.6rem;
`;

const Ikon = styled.div`
    display: block;
`;

const StipletLinje = styled.div`
    border-left: 0.15rem dotted ${ABorderStrong};
    margin-left: 0.75rem;
    height: calc(100% - 2em);
`;

const Tekst = styled.div`
    margin-left: 0.7rem;
    > *:not(:last-child) {
        margin: 0.25rem 0 0.25rem 0;
    }
`;

const Beskrivelse = styled(BodyShort)`
    white-space: pre-wrap;
    word-wrap: break-word;
    padding: ${ASpacing1} 0;
`;

interface IHistorikkOppdatering {
    behandling: Behandling;
    steg: StegType;
    historikkHendelse?: HistorikkHendelse;
    beskrivelse?: string;
    opprettetAv: string;
    endretTid: string;
}

const HistorikkInnslag: React.FunctionComponent<IHistorikkOppdatering> = ({
    behandling,
    steg,
    historikkHendelse,
    beskrivelse,
    opprettetAv,
    endretTid,
}) => {
    const labelTekst = historikkHendelse
        ? hendelseHistorikkTilTekst[historikkHendelse]
        : behandlingStegFullførtTilTekst[steg];

    return (
        <Innslag>
            <Ikon>
                <PersonCircleIcon fontSize="1.5rem" height={'1em'} />
                <StipletLinje />
            </Ikon>
            <Tekst>
                <Label size="small">{labelTekst}</Label>
                {beskrivelse && <Beskrivelse size="small">{beskrivelse}</Beskrivelse>}
                {steg === StegType.BEHANDLING_FERDIGSTILT && (
                    <BodyShort>
                        {utledStegutfallForFerdigstiltBehandling(behandling, steg)}
                    </BodyShort>
                )}
                <Detail size="small">
                    {formaterIsoDatoTid(endretTid)} | {opprettetAv}
                </Detail>
            </Tekst>
        </Innslag>
    );
};

export default HistorikkInnslag;
