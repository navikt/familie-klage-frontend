import * as React from 'react';
import { IBehandlingshistorikk } from '../Høyremeny/behandlingshistorikk';
import {
    Behandling,
    BehandlingResultat,
    behandlingStegTilTekst,
    StegType,
} from '../../../App/typer/fagsak';
import styled from 'styled-components';
import { Alert, Detail, Heading, Label } from '@navikt/ds-react';
import { formaterIsoDato, formaterIsoKlokke } from '../../../App/utils/formatter';
import { Clock, SuccessColored } from '@navikt/ds-icons';
import { utledStegutfallForFerdigstiltBehandling } from '../utils';
import { fjernDuplikatStegFraHistorikk } from './utils';

const Flexbox = styled.div`
    display: flex;
    @media (max-width: 1449px) {
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    @media (min-width: 1450px) {
        flex-direction: row;
    }
`;

const HistorikkInnslag = styled.div`
    @media (max-width: 1449px) {
        width: 10rem;
    }
    @media (min-width: 1450px) {
        flex-grow: 1;
        display: grid;
        grid-template-columns: auto 5rem auto;
        align-self: stretch;
    }
`;

const RevurderingAlertContainer = styled.div`
    @media (max-width: 1449px) {
        width: 20rem;
    }
    @media (min-width: 1450px) {
        flex-grow: 1;
        display: grid;
        grid-template-columns: auto 20rem auto;
    }
`;

const LinjeStiplet = styled.div`
    @media (max-width: 1449px) {
        border-left: 2px dashed black;
        margin: 0 auto 2px;
        width: 0px;
        height: 2rem;
    }
    @media (min-width: 1450px) {
        border-top: 2px dashed black;
        margin-top: 3.25rem;
        margin-left: 2px;
        min-width: 3rem;
    }
`;

const LinjeSort = styled.div<{ synlig: boolean }>`
    @media (max-width: 1449px) {
        ${(props) => (props.synlig ? '' : 'transparent')}
        border-left: 2px solid black;
        margin: 0 auto;
        height: 2rem;
        width: 0px;
    }
    @media (min-width: 1450px) {
        border-top: 2px solid ${(props) => (props.synlig ? 'black' : 'transparent')};
        margin-top: 3.25rem;
        min-width: 3rem;
    }
`;

const NodeContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-self: flex-start;
    text-align: center;
    align-items: center;
`;

const Tittel = styled(Heading)<{ tittelErToLinjer: boolean }>`
    min-width: 9rem;
    margin-bottom: 0.75rem;

    @media (min-width: 1450px) {
        ${(props) =>
            props.tittelErToLinjer
                ? 'position: relative; bottom: 1rem; margin-bottom: -0.75rem'
                : ''}
    }
`;

const Suksess = styled(SuccessColored)`
    margin: auto;
    margin-bottom: 0.5rem;
`;

export const Tidslinje: React.FC<{
    behandling: Behandling;
    behandlingHistorikk: IBehandlingshistorikk[];
}> = ({ behandling, behandlingHistorikk }) => {
    const historikk = fjernDuplikatStegFraHistorikk(behandlingHistorikk);

    const måManueltOppretteRevurdering = behandling.resultat === BehandlingResultat.MEDHOLD;
    return (
        <Flexbox>
            {historikk.map((steg, index) => (
                <HistorikkInnslag key={index}>
                    <LinjeSort synlig={index > 0} />
                    <Node behandling={behandling} steg={steg} />
                    {index + 1 < historikk.length && <LinjeSort synlig={true} />}
                    {måManueltOppretteRevurdering && index + 1 === historikk.length && (
                        <LinjeStiplet />
                    )}
                </HistorikkInnslag>
            ))}
            {måManueltOppretteRevurdering && (
                <RevurderingAlertContainer>
                    <LinjeStiplet />
                    <Alert variant={'info'}>
                        <Heading spacing size="small" level="3">
                            Revurdering
                        </Heading>
                        Det må manuelt opprettes en revurdering for å fatte nytt vedtak.
                    </Alert>
                </RevurderingAlertContainer>
            )}
        </Flexbox>
    );
};

const Node: React.FC<{ behandling: Behandling; steg: IBehandlingshistorikk }> = ({
    behandling,
    steg,
}) => {
    const tittelErToLinjer =
        steg.steg === StegType.OVERFØRING_TIL_KABAL || steg.steg === StegType.KABAL_VENTER_SVAR;

    return (
        <NodeContainer>
            <Tittel level="1" size="xsmall" tittelErToLinjer={tittelErToLinjer}>
                {behandlingStegTilTekst[steg.steg]}
            </Tittel>
            {steg.endretTid ? <Suksess width={36} height={36} /> : <Clock width={36} height={36} />}
            <Detail size="small">{steg.endretTid && formaterIsoDato(steg.endretTid)}</Detail>
            <Detail size="small">{steg.endretTid && formaterIsoKlokke(steg.endretTid)}</Detail>
            <Label size={'small'}>
                {utledStegutfallForFerdigstiltBehandling(behandling, steg.steg)}
            </Label>
        </NodeContainer>
    );
};
