import * as React from 'react';
import { IBehandlingshistorikk } from '../Høyremeny/behandlingshistorikk';
import { Behandling, behandlingStegTilTekst } from '../../../App/typer/fagsak';
import styled from 'styled-components';
import { BodyShort, Detail, Heading, Label } from '@navikt/ds-react';
import { formaterIsoDato, formaterIsoKlokke } from '../../../App/utils/formatter';
import { Clock, SuccessColored } from '@navikt/ds-icons';
import {
    KlagehendelseType,
    klagehendelseTypeTilTekst,
    utfallTilTekst,
} from '../../../App/typer/klageresultat';
import { utledStegutfallForFerdigstiltBehandling } from '../utils';
import { fjernDuplikatStegFraHistorikk } from './utils';

const Flexbox = styled.div`
    display: flex;
    @media (max-width: 1400px) {
        flex-direction: column;
        justify-content: center;
    }
    @media (min-width: 1400px) {
        flex-direction: row;
    }
`;

const HistorikkInnslag = styled.div`
    @media (max-width: 1400px) {
        width: 10rem;
    }
    @media (min-width: 1400px) {
        flex-grow: 1;
        display: grid;
        grid-template-columns: auto 5rem auto;
    }
`;

const LinjeSort = styled.div<{ synlig: boolean }>`
    @media (max-width: 1400px) {
        ${(props) => (props.synlig ? '' : 'transparent')}
        border-left: 2px solid black;
        margin-left: 5rem;
        height: 2rem;
    }
    @media (min-width: 1400px) {
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
    white-space: nowrap;
    align-items: center;
`;

const Tittel = styled(Heading)`
    margin-bottom: 0.75rem;
`;

const Suksess = styled(SuccessColored)`
    margin: auto;
    margin-bottom: 0.5rem;
`;

const StyledAnkeInfo = styled.div`
    display: flex;
`;

const StyledAnkeInfoBox = styled.div`
    margin: 5rem 1rem 1rem 4rem;
`;

const StyledBodyShort = styled(BodyShort)`
    margin-left: 1rem;
`;

export const Tidslinje: React.FC<{
    behandling: Behandling;
    behandlingHistorikk: IBehandlingshistorikk[];
}> = ({ behandling, behandlingHistorikk }) => {
    const historikk = fjernDuplikatStegFraHistorikk(behandlingHistorikk);

    return (
        <>
            <Flexbox>
                {historikk.map((steg, index) => (
                    <HistorikkInnslag key={index}>
                        <LinjeSort synlig={index > 0} />
                        <Node behandling={behandling} steg={steg} />
                        <LinjeSort synlig={index + 1 < historikk.length} />
                    </HistorikkInnslag>
                ))}
            </Flexbox>
            <AnkeInfo behandling={behandling} />
        </>
    );
};
const AnkeInfo: React.FC<{ behandling: Behandling }> = ({ behandling }) => {
    const resultatUtenKlagebehandlinger = behandling.klageresultat.filter(
        (resultat) => resultat.type != KlagehendelseType.KLAGEBEHANDLING_AVSLUTTET
    );
    return (
        <StyledAnkeInfoBox>
            {resultatUtenKlagebehandlinger.map((res) => (
                <StyledAnkeInfo key={res.mottattEllerAvsluttetTidspunkt}>
                    <Label size={'small'}>{klagehendelseTypeTilTekst[res.type]}</Label>:
                    <StyledBodyShort size={'small'}>
                        {res.mottattEllerAvsluttetTidspunkt}
                    </StyledBodyShort>
                    <StyledBodyShort size={'small'}>
                        {res.utfall && utfallTilTekst[res.utfall]}
                    </StyledBodyShort>
                </StyledAnkeInfo>
            ))}
        </StyledAnkeInfoBox>
    );
};
const Node: React.FC<{ behandling: Behandling; steg: IBehandlingshistorikk }> = ({
    behandling,
    steg,
}) => {
    return (
        <NodeContainer>
            <Tittel level="1" size="xsmall">
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
