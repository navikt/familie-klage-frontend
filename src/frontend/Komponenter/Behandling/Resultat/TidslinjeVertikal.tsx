import * as React from 'react';
import { IBehandlingshistorikk } from '../Høyremeny/behandlingshistorikk';
import {
    behandlingStegInformasjonTilTekst,
    behandlingStegTilTekst,
    StegType,
} from '../../../App/typer/fagsak';
import { formaterIsoDatoTid } from '../../../App/utils/formatter';
import navFarger from 'nav-frontend-core';
import styled from 'styled-components';
import { Detail, Heading, Tooltip } from '@navikt/ds-react';
import { Ikon } from './Ikon';

const StyledIkon = styled.div`
    display: block;
    margin-right: 1rem;
`;

const StyledLinjeGrå = styled.div`
    border-left: 0.1rem solid ${navFarger.navGra40};
    margin: 0 0 0.7rem 1.1rem;
    height: 4rem;
`;

const StyledLinjeSort = styled.div`
    border-left: 0.1rem solid black;
    margin: 0 0 0.7rem 1.1rem;
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

export const TidslinjeVertikal: React.FC<{
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
                            <StyledLinjeSort />
                        ) : (
                            <StyledLinjeGrå />
                        )}
                    </>
                )}
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
            {behandlingHistorikk ? (
                <StyledTekstFullført>
                    <Tooltip content={behandlingStegInformasjonTilTekst[steg]} placement="top">
                        <Heading level="1" size="xsmall">
                            {behandlingStegTilTekst[steg]}
                        </Heading>
                    </Tooltip>
                    <Detail size="small">
                        {formaterIsoDatoTid(behandlingHistorikk.endretTid)}
                    </Detail>
                </StyledTekstFullført>
            ) : (
                <StyledTekstIkkeFullført>
                    <Tooltip content={behandlingStegInformasjonTilTekst[steg]} placement="top">
                        {aktivtSteg ? (
                            <Heading level="1" size="xsmall">
                                {behandlingStegTilTekst[steg]}
                            </Heading>
                        ) : (
                            <HeadingIkkeFullført level="1" size="xsmall">
                                {behandlingStegTilTekst[steg]}
                            </HeadingIkkeFullført>
                        )}
                    </Tooltip>
                </StyledTekstIkkeFullført>
            )}
        </StyledTidslinje>
    );
};
