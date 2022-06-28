import * as React from 'react';
import { FC, useEffect } from 'react';
import Høyremeny from './Høyremeny/Høyremeny';
import styled from 'styled-components';
import Fanemeny from './Fanemeny/Fanemeny';
import navFarger from 'nav-frontend-core';
import BehandlingRoutes from './BehandlingRoutes';
import { BehandlingProvider, useBehandling } from '../../App/context/BehandlingContext';
import { ModalProvider } from '../../App/context/ModalContext';
import ModalController from '../../Felles/Modal/ModalController';
// import DataViewer from '../../Felles/DataViewer/DataViewer';
import VisittkortComponent from '../../Felles/Visittkort/Visittkort';
import { Behandling, BehandlingResultat } from '../../App/typer/fagsak';
// import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import { useSetValgtFagsakId } from '../../App/hooks/useSetValgtFagsakId';
import { Behandlingstype } from '../../App/typer/behandlingstype';
import { BehandlingStatus } from '../../App/typer/behandlingstatus';
import { Stønadstype } from '../../App/typer/behandlingstema';
import { Behandlingsårsak } from '../../App/typer/Behandlingsårsak';
import personopplysningerMock from './personopplysningerMock.json';

export const behandlingMock: Behandling = {
    id: 'ad983bff-d807-4ade-928e-1093e16ec2ac',
    type: Behandlingstype.FØRSTEGANGSBEHANDLING,
    steg: 'FATTAR_VEDTAK',
    status: BehandlingStatus.UTREDES,
    stønadstype: Stønadstype.BARNETILSYN,
    fagsakId: '8de5ab73-e135-4cb3-b2cc-222f4cb5e339',
    resultat: BehandlingResultat.HENLAGT,
    behandlingsårsak: Behandlingsårsak.KLAGE,
    sistEndret: '2020-10-09T11:27:15Z',
    opprettet: '2020-11-24T16:51:06.174',
    endringerIRegistergrunnlag: {
        medlemskap: ['statsborgerskap'],
    },
};

const Container = styled.div`
    display: flex;

    flex-shrink: 2;
`;

interface InnholdWrapperProps {
    åpenHøyremeny: boolean;
}

interface HøyreMenyWrapperProps {
    åpenHøyremeny: boolean;
}

const HøyreMenyWrapper = styled.div<HøyreMenyWrapperProps>`
    border-left: 2px solid ${navFarger.navGra40};

    flex-shrink: 1;
    flex-grow: 0;

    width: ${(p) => (p.åpenHøyremeny ? '20rem' : '1.5rem')};
    min-width: ${(p) => (p.åpenHøyremeny ? '20rem' : '1.5rem')};

    transition: all 0.25s;
`;

const InnholdWrapper = styled.div<InnholdWrapperProps>`
    flex-shrink: 0;
    flex-grow: 1;
    flex-basis: 0px;
    min-width: 0px;

    overflow-x: scroll;

    height: 90vh;

    max-width: ${(p) => (p.åpenHøyremeny ? 'calc(100% - 20rem)' : '100%')};
`;

const BehandlingContainer: FC = () => {
    return (
        <ModalProvider>
            <BehandlingProvider>
                <ModalController />
                <BehandlingOverbygg />
            </BehandlingProvider>
        </ModalProvider>
    );
};

const BehandlingContent: FC<{
    behandling: Behandling;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    personopplysninger: any;
}> = ({ behandling, personopplysninger }) => {
    useSetValgtFagsakId(behandling.fagsakId);
    const { åpenHøyremeny } = useBehandling();

    return (
        <>
            <VisittkortComponent data={personopplysninger} behandling={behandlingMock} />
            <Container>
                <InnholdWrapper åpenHøyremeny={åpenHøyremeny}>
                    <Fanemeny behandlingId={behandlingMock.id} />
                    <BehandlingRoutes />
                </InnholdWrapper>
                <HøyreMenyWrapper åpenHøyremeny={åpenHøyremeny}>
                    <Høyremeny åpenHøyremeny={åpenHøyremeny} behandlingId={behandlingMock.id} />
                </HøyreMenyWrapper>
            </Container>
        </>
    );
};

const BehandlingOverbygg: FC = () => {
    //    const { behandling, personopplysningerResponse } = useBehandling();

    useEffect(() => {
        document.title = 'Behandling';
    }, []);

    return (
        <BehandlingContent
            behandling={behandlingMock}
            personopplysninger={personopplysningerMock.data}
        />
    );
};

export default BehandlingContainer;
