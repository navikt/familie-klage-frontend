import * as React from 'react';
import { ABorderStrong } from '@navikt/ds-tokens/dist/tokens';
import { BodyShort, Detail, Label } from '@navikt/ds-react';
import styled from 'styled-components';
import { formaterIsoDatoTid } from '../../../App/utils/formatter';
import { Behandling, behandlingStegFullførtTilTekst, StegType } from '../../../App/typer/fagsak';
import { PersonCircleIcon } from '@navikt/aksel-icons';
import { utledStegutfallForFerdigstiltBehandling } from '../utils';
import { BehandlingStatus, behandlingStatusTilTekst } from '../../../App/typer/behandlingstatus';

const Innslag = styled.div`
    display: flex;
    margin: 1rem 1.6rem;
`;

const Ikon = styled.div`
    display: block;
`;

const StipletLinje = styled.div`
    border-left: 0.15rem dotted ${ABorderStrong};
    margin-top: 0.5rem;
    margin-left: 0.75rem;
    height: 1.5rem;
`;

const Tekst = styled.div`
    margin-left: 0.7rem;
`;

interface IHistorikkOppdatering {
    behandling: Behandling;
    steg: StegType;
    behandlingStatus?: BehandlingStatus;
    opprettetAv: string;
    endretTid: string;
    tekst?: string;
}

const HistorikkInnslag: React.FunctionComponent<IHistorikkOppdatering> = ({
    behandling,
    steg,
    behandlingStatus,
    opprettetAv,
    endretTid,
}) => {
    const labelTekst =
        behandlingStatus == BehandlingStatus.SATT_PÅ_VENT ||
        behandlingStatus === BehandlingStatus.UTREDES
            ? behandlingStatusTilTekst[behandlingStatus]
            : behandlingStegFullførtTilTekst[steg];

    return (
        <Innslag>
            <Ikon>
                <PersonCircleIcon fontSize="1.5rem" />
                <StipletLinje />
            </Ikon>
            <Tekst>
                <Label size="small">{labelTekst}</Label>
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
