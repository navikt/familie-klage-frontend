import * as React from 'react';
import { IBehandlingshistorikk } from '../Høyremeny/behandlingshistorikk';
import {
    behandlingStegFullførtTilTekst,
    behandlingStegTilTekst,
    StegType,
} from '../../../App/typer/fagsak';
import { formaterIsoDatoTid } from '../../../App/utils/formatter';
import navFarger from 'nav-frontend-core';
import styled from 'styled-components';
import { Detail, Heading } from '@navikt/ds-react';

const StyledIkon = styled.div`
    display: block;
    margin-right: 1rem;
`;

const StripletLinjeGrå = styled.div`
    border-left: 0.2rem dotted ${navFarger.navGra40};
    margin: -0.4rem 0 0 1rem;
    height: 4rem;
`;

const StripletLinjeSort = styled.div`
    border-left: 0.2rem dotted black;
    margin: -0.4rem 0 0 0.9rem;
    height: 4rem;
`;

const StyledTekstFullført = styled.div`
    display: block;
    position: absolute;
    bottom: 0.2rem;
    margin-left: 3rem;
`;

const StyledTekstIkkeFullført = styled.div`
    display: block;
    position: absolute;
    bottom: 0.7rem;
    margin-left: 3rem;
`;

const StyledTidslinje = styled.div`
    display: flex;
    position: relative;
`;

const HeadingIkkeFullført = styled(Heading)`
    color: ${navFarger.navGra40};
`;

export const Tidslinje: React.FC<{
    steg: StegType;
    behandlingHistorikk?: IBehandlingshistorikk;
    førsteObjekt: boolean;
    aktivtSteg: boolean;
}> = ({ steg, behandlingHistorikk, førsteObjekt, aktivtSteg }) => {
    return (
        <StyledTidslinje>
            <StyledIkon>
                {!førsteObjekt && (
                    <>
                        {behandlingHistorikk || aktivtSteg ? (
                            <StripletLinjeSort />
                        ) : (
                            <StripletLinjeGrå />
                        )}
                    </>
                )}
                {behandlingHistorikk ? (
                    <svg
                        width="35"
                        height="35"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        focusable="false"
                        role="img"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0Zm0 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm5.047 5.671 1.399 1.43-8.728 8.398L6 14.02l1.395-1.434 2.319 2.118 7.333-7.032Z"
                            fill="green"
                        />
                    </svg>
                ) : (
                    <svg
                        width="35"
                        height="35"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        focusable="false"
                        role="img"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0Zm0 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm1 4v7H6v-2h5V6h2Z"
                            fill={aktivtSteg ? 'currentcolor' : 'grey'}
                        />
                    </svg>
                )}
            </StyledIkon>
            {behandlingHistorikk || aktivtSteg ? (
                <>
                    {aktivtSteg ? (
                        <StyledTekstIkkeFullført>
                            <Heading level="1" size="xsmall">
                                {behandlingStegTilTekst[steg]}
                            </Heading>
                        </StyledTekstIkkeFullført>
                    ) : (
                        <StyledTekstFullført>
                            <Heading level="1" size="xsmall">
                                {behandlingStegFullførtTilTekst[steg]}
                            </Heading>
                            <Detail>{formaterIsoDatoTid(behandlingHistorikk.endretTid)}</Detail>
                        </StyledTekstFullført>
                    )}
                </>
            ) : (
                <StyledTekstIkkeFullført>
                    <HeadingIkkeFullført level="1" size="xsmall">
                        {behandlingStegTilTekst[steg]}
                    </HeadingIkkeFullført>
                </StyledTekstIkkeFullført>
            )}
        </StyledTidslinje>
    );
};
