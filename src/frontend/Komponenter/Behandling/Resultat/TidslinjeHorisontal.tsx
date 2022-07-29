import * as React from 'react';
import { IBehandlingshistorikk } from '../Høyremeny/behandlingshistorikk';
import {
    behandlingStegInformasjonTilTekst,
    behandlingStegTilTekst,
    StegType,
} from '../../../App/typer/fagsak';
import { formaterIsoDato, formaterIsoKlokke } from '../../../App/utils/formatter';
import navFarger from 'nav-frontend-core';
import styled from 'styled-components';
import { Detail, Heading, Tooltip } from '@navikt/ds-react';
import { Ikon } from './Ikon';

const StyledIkon = styled.div`
    margin: 0 0.5rem 0 0.5rem;
`;

const StyledLinjeSort = styled.div`
    border-top: 0.1rem solid black;
    margin-top: 1rem;
    min-width: 3rem;
    max-width: 12rem;
`;

const StyledLinjeGrå = styled.div`
    border-top: 0.1rem solid ${navFarger.navGra40};
    margin-top: 1rem;
    min-width: 3rem;
    max-width: 12rem;
`;

const StyledTidslinjeMedTekst = styled.div`
    text-align: center;
`;

const TomDiv = styled.div`
    min-width: 3rem;
    max-width: 12rem;
`;

const StyledTidslinje = styled.div`
    display: grid;
    grid-template-columns: auto auto auto;
`;

const HeadingIkkeFullført = styled(Heading)`
    color: ${navFarger.navGra40};
    margin-bottom: 1rem;
`;

const HeadingFullført = styled(Heading)`
    margin-bottom: 1rem;
`;

export const TidslinjeHorisontal: React.FC<{
    steg: StegType;
    behandlingHistorikk?: IBehandlingshistorikk;
    førsteObjekt: boolean;
    sisteObjekt: boolean;
    aktivtSteg: boolean;
}> = ({ steg, behandlingHistorikk, førsteObjekt, sisteObjekt, aktivtSteg }) => {
    return (
        <StyledTidslinjeMedTekst>
            <Tooltip content={behandlingStegInformasjonTilTekst[steg]} placement="top">
                {behandlingHistorikk || aktivtSteg ? (
                    <HeadingFullført level="1" size="xsmall">
                        {behandlingStegTilTekst[steg]}
                    </HeadingFullført>
                ) : (
                    <HeadingIkkeFullført level="1" size="xsmall">
                        {behandlingStegTilTekst[steg]}
                    </HeadingIkkeFullført>
                )}
            </Tooltip>
            <StyledTidslinje>
                {!førsteObjekt ? (
                    <>
                        {behandlingHistorikk || aktivtSteg ? (
                            <StyledLinjeSort />
                        ) : (
                            <StyledLinjeGrå />
                        )}
                    </>
                ) : (
                    <TomDiv />
                )}
                <StyledIkon>
                    {behandlingHistorikk ? (
                        <Ikon>
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0Z"
                                fill="#007C2E"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="m17.047 7.671 1.399 1.43-8.728 8.398L6 14.02l1.395-1.434 2.319 2.118 7.333-7.032Z"
                                fill="#fff"
                            />
                        </Ikon>
                    ) : (
                        <Ikon>
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0Zm0 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm1 4v7H6v-2h5V6h2Z"
                                fill={aktivtSteg ? 'currentcolor' : 'grey'}
                            />
                        </Ikon>
                    )}
                </StyledIkon>
                {!sisteObjekt ? (
                    <>{behandlingHistorikk ? <StyledLinjeSort /> : <StyledLinjeGrå />}</>
                ) : (
                    <TomDiv />
                )}
            </StyledTidslinje>
            {behandlingHistorikk && (
                <>
                    <Detail size="small">{formaterIsoDato(behandlingHistorikk.endretTid)}</Detail>
                    <Detail size="small">{formaterIsoKlokke(behandlingHistorikk.endretTid)}</Detail>
                </>
            )}
        </StyledTidslinjeMedTekst>
    );
};
