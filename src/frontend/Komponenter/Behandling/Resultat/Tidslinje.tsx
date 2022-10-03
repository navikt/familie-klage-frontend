import * as React from 'react';
import { IBehandlingshistorikk } from '../Høyremeny/behandlingshistorikk';
import { Behandling } from '../../../App/typer/fagsak';
import { fjernDuplikatStegFraHistorikk, utledTekstForTidslinje } from './utils';
import styled from 'styled-components';
import Oppfylt from '../../../Felles/Ikoner/Oppfylt';
import { Detail, Heading } from '@navikt/ds-react';
import { formaterIsoDato, formaterIsoKlokke } from '../../../App/utils/formatter';

const Flexbox = styled.div`
    display: flex;
    @media (max-width: 1300px) {
        flex-direction: column;
        justify-content: center;
    }
    @media (min-width: 1300px) {
        flex-direction: row;
    }
`;

const HistorikkInnslag = styled.div`
    @media (max-width: 1300px) {
        width: 10rem;
    }
    @media (min-width: 1300px) {
        flex-grow: 1;
        display: grid;
        grid-template-columns: auto 5rem auto;
    }
`;

const LinjeSort = styled.div<{ synlig: boolean }>`
    @media (max-width: 1300px) {
        ${(props) => (props.synlig ? '' : 'transparent')}
        border-left: 2px solid black;
        margin-left: 5rem;
        height: 2rem;
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
    white-space: nowrap;
    align-items: center;
`;

const Tittel = styled(Heading)`
    margin-bottom: 0.75rem;
`;

const Ikon = styled(Oppfylt)`
    margin: auto;
    margin-bottom: 0.5rem;
`;

export const Tidslinje: React.FC<{
    behandling: Behandling;
    behandlingHistorikk: IBehandlingshistorikk[];
}> = ({ behandling, behandlingHistorikk }) => {
    const historikk = fjernDuplikatStegFraHistorikk(behandlingHistorikk);
    return (
        <Flexbox>
            {historikk.map((steg, index) => (
                <HistorikkInnslag key={index}>
                    <LinjeSort synlig={index > 0} />
                    <Node behandling={behandling} steg={steg} />
                    <LinjeSort synlig={index + 1 < historikk.length} />
                </HistorikkInnslag>
            ))}
        </Flexbox>
    );
};

const Node: React.FC<{ behandling: Behandling; steg: IBehandlingshistorikk }> = ({
    behandling,
    steg,
}) => {
    return (
        <NodeContainer>
            <Tittel level="1" size="xsmall">
                {utledTekstForTidslinje(behandling, steg.steg)}
            </Tittel>
            <Ikon width={36} heigth={36} />
            <Detail size="small">{formaterIsoDato(steg.endretTid)}</Detail>
            <Detail size="small">{formaterIsoKlokke(steg.endretTid)}</Detail>
        </NodeContainer>
    );
};
