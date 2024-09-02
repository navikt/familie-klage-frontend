import * as React from 'react';
import styled from 'styled-components';
import { ABlue400, AGray100, ABorderDivider, ABlue500 } from '@navikt/ds-tokens/dist/tokens';
import { Høyremenyvalg } from './Høyremeny';
import { ClockFillIcon, FolderIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

const StyledIkonWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    border-top: ${ABorderDivider} solid 2px;
    border-bottom: ${ABorderDivider} solid 2px;
    text-align: center;

    .navds-body-short {
        font-size: 12px;
        margin-top: -5px;
    }
`;

interface IkonProps {
    erAktiv: boolean;
}
const StyledIkon = styled.div<IkonProps>`
    flex: 1;
    padding-top: 0.75rem;
    padding-bottom: 0.25rem;

    background-color: ${ABlue500};
    color: ${ABlue500};

    &:hover {
        cursor: pointer;
        svg {
            fill: ${ABlue400};
        }
        border-bottom: 5px solid ${ABlue400};
    }

    background-color: ${(props) => (props.erAktiv ? AGray100 : 'white')};
    border-bottom: 5px solid ${(props) => (props.erAktiv ? ABlue500 : 'white')};
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
                <ClockFillIcon aria-label="Historikk" fontSize="1.5em" />
                <BodyShort size={'small'}>Historikk</BodyShort>
            </StyledIkon>
            <StyledIkon
                role={'button'}
                erAktiv={aktiv === Høyremenyvalg.Dokumenter}
                onClick={() => settAktiv(Høyremenyvalg.Dokumenter)}
            >
                <FolderIcon aria-label="Dokumentoversikt" fontSize="1.5em" />
                <BodyShort size={'small'}>Dokumenter</BodyShort>
            </StyledIkon>
        </StyledIkonWrapper>
    );
};

export default Valgvisning;
