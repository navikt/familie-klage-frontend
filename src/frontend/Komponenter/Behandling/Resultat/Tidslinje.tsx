import * as React from 'react';
import { IBehandlingshistorikk } from '../Høyremeny/behandlingshistorikk';
import { behandlingStegTilTekst, StegType } from '../../../App/typer/fagsak';
import { fjernDuplikatStegFraHistorikk } from './utils';
import styled from 'styled-components';
import Oppfylt from '../../../Felles/Ikoner/Oppfylt';
import { Detail, Heading } from '@navikt/ds-react';
import { formaterIsoDato, formaterIsoKlokke } from '../../../App/utils/formatter';

const FlexRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const HistorikkInnslag = styled.div`
    @media (max-width: 1300px) {
        display: flex;
        position: relative;
    }
    @media (min-width: 1300px) {
        flex-grow: 1;
        display: grid;
        grid-template-columns: auto 5rem auto;
    }
`;

const LinjeSort = styled.div<{ synlig: boolean }>`
    @media (max-width: 1300px) {
        border-left: 0.1rem solid black;
        margin: 0 0 0.7rem 1.1rem;
        height: 4rem;
    }
    @media (min-width: 1300px) {
        border-top: 2px solid ${(props) => (props.synlig ? 'black' : 'transparent')};
        margin-top: 3.25rem;
        min-width: 3rem;
    }
`;

const NodeContainer = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
`;

const Tittel = styled(Heading)`
    margin-bottom: 0.75rem;
`;

const Ikon = styled(Oppfylt)`
    margin: auto;
    margin-bottom: 0.5rem;
`;

export const Tidslinje: React.FC<{
    behandlingHistorikk: IBehandlingshistorikk[];
    aktivtSteg: StegType;
}> = ({ behandlingHistorikk }) => {
    const historikk = fjernDuplikatStegFraHistorikk(behandlingHistorikk);
    return (
        <FlexRow>
            {historikk.map((steg, index) => (
                <HistorikkInnslag key={index}>
                    <LinjeSort synlig={index > 0} />
                    <Node steg={steg} />
                    <LinjeSort synlig={index + 1 < historikk.length} />
                </HistorikkInnslag>
            ))}
        </FlexRow>
    );
};

const Node: React.FC<{ steg: IBehandlingshistorikk }> = ({ steg }) => {
    return (
        <NodeContainer>
            <Tittel level="1" size="xsmall">
                {behandlingStegTilTekst[steg.steg]}
            </Tittel>
            <Ikon width={36} heigth={36} />
            <Detail size="small">{formaterIsoDato(steg.endretTid)}</Detail>
            <Detail size="small">{formaterIsoKlokke(steg.endretTid)}</Detail>
        </NodeContainer>
    );
};
