import * as React from 'react';
import { BrukerMedBlyantIkon } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import navFarger from 'nav-frontend-core';
import { Detail, Label } from '@navikt/ds-react';
import styled from 'styled-components';
import { Steg, stegTilTekst } from './behandlingshistorikk';

const Oppdatering = styled.div`
    display: flex;
    margin: 1.6rem;
`;

const StyledIkon = styled.div`
    display: block;
`;

const StripletLinje = styled.div`
    border-left: 0.15rem dotted ${navFarger.navGra40};
    margin: -0.6rem 0 0 0.68rem;
    height: 1.35rem;
`;

const TekstligInformasjon = styled.div`
    margin-left: 0.7rem;
`;

const datoFormatering = (datoString: string) => {
    const dato = new Date(datoString);
    return (
        dato.getDate() +
        '.' +
        dato.getMonth() +
        '.' +
        dato.getFullYear() +
        '  ' +
        dato.getHours() +
        ':' +
        dato.getMinutes()
    );
};

interface IHistorikkOppdatering {
    steg: Steg;
    opprettetAv: string;
    endretTid: string;
}

const HistorikkOppdatering: React.FunctionComponent<IHistorikkOppdatering> = ({
    steg,
    opprettetAv,
    endretTid,
}) => {
    return (
        <Oppdatering>
            <StyledIkon>
                <BrukerMedBlyantIkon
                    backgroundColor={navFarger.navLysGra}
                    frontColor={navFarger.navMorkGra}
                />
                <StripletLinje />
            </StyledIkon>
            <TekstligInformasjon>
                <Label size="small">{stegTilTekst[steg]}</Label>
                <Detail size="small">
                    {datoFormatering(endretTid)} | {opprettetAv}
                </Detail>
            </TekstligInformasjon>
        </Oppdatering>
    );
};

export default HistorikkOppdatering;
