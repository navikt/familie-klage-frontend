import * as React from 'react';
import styled from 'styled-components';
import {
    ABlue400,
    AGray100,
    ABorderStrong,
    AIconInfo,
    ATextAction,
} from '@navikt/ds-tokens/dist/tokens';
import { Høyremenyvalg } from './Høyremeny';
import { Folder, ClockFilled } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

const StyledIkonWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    border-bottom: ${ABorderStrong} solid 2px;
    text-align: center;
    .typo-normal {
        font-size: 12px;
        margin-top: -5px;
    }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface IkonProps {
    erAktiv: boolean;
}
const StyledIkon = styled.div<IkonProps>`
    flex: 1;
    padding-top: 1rem;
    padding-bottom: 0.62rem;
    background-color: ${AIconInfo};
    color: ${ATextAction};
    :hover {
        cursor: pointer;
        svg {
            fill: ${ABlue400};
        }
        border-bottom: 5px solid ${ABlue400};
    }
    background-color: ${(props) => (props.erAktiv ? AGray100 : 'white')};
    border-bottom: 5px solid ${(props) => (props.erAktiv ? ABlue400 : 'white')};
`;

interface ValgvisningProps {
    settAktiv: (aktivtValg: Høyremenyvalg) => void;
    aktiv: Høyremenyvalg;
}

const Valgvisning: React.FC<ValgvisningProps> = ({ aktiv, settAktiv }) => {
    return (
        <StyledIkonWrapper>
            <StyledIkon
                role={'button'}
                erAktiv={aktiv === Høyremenyvalg.Historikk}
                onClick={() => settAktiv(Høyremenyvalg.Historikk)}
            >
                <ClockFilled aria-label="Historikk" />
                <BodyShort size={'small'}>Historikk</BodyShort>
            </StyledIkon>
            <StyledIkon
                role={'button'}
                erAktiv={aktiv === Høyremenyvalg.Dokumenter}
                onClick={() => settAktiv(Høyremenyvalg.Dokumenter)}
            >
                <Folder />
                <BodyShort size={'small'}>Dokumenter</BodyShort>
            </StyledIkon>
        </StyledIkonWrapper>
    );
};

export default Valgvisning;
