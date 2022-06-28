import * as React from 'react';
import { BrukerMedBlyantIkon } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import navFarger from 'nav-frontend-core';
import { Detail, Label } from '@navikt/ds-react';
import styled from 'styled-components';

interface IHistorikkOppdatering {
    tittel: string;
    dato: string;
    tidspunkt: string;
    behandler: string;
}

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

const HistorikkOppdatering: React.FunctionComponent<IHistorikkOppdatering> = ({
    tittel,
    dato,
    tidspunkt,
    behandler,
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
                <Label size="small">{tittel}</Label>
                <Detail size="small">
                    {dato} {tidspunkt} | {behandler}
                </Detail>
            </TekstligInformasjon>
        </Oppdatering>
    );
};

export default HistorikkOppdatering;
