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
import VisittkortComponent from '../../Felles/Visittkort/Visittkort';
import { Behandling } from '../../App/typer/fagsak';
import { useSetValgtFagsakId } from '../../App/hooks/useSetValgtFagsakId';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';

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

export const hentBehandlingIdFraUrl = (): string => {
    return location.href.substring(
        location.href.indexOf('behandling/') + 11,
        location.href.indexOf('behandling/') + 47
    );
};

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
    personopplysninger: IPersonopplysninger;
}> = ({ behandling, personopplysninger }) => {
    useSetValgtFagsakId(behandling.fagsakId);
    const { åpenHøyremeny } = useBehandling();

    return (
        <>
            <VisittkortComponent personopplysninger={personopplysninger} behandling={behandling} />
            <Container>
                <InnholdWrapper åpenHøyremeny={åpenHøyremeny}>
                    <Fanemeny behandling={behandling} />
                    <BehandlingRoutes behandling={behandling} />
                </InnholdWrapper>
                <HøyreMenyWrapper åpenHøyremeny={åpenHøyremeny}>
                    <Høyremeny åpenHøyremeny={åpenHøyremeny} behandling={behandling} />
                </HøyreMenyWrapper>
            </Container>
        </>
    );
};

const BehandlingOverbygg: FC = () => {
    const { personopplysningerResponse, behandling } = useBehandling();

    useEffect(() => {
        document.title = 'Behandling';
    }, []);
    if (behandling.status === 'SUKSESS' && personopplysningerResponse.status === 'SUKSESS') {
        return (
            <BehandlingContent
                behandling={behandling.data}
                personopplysninger={personopplysningerResponse.data}
            />
        );
    } else {
        return <div>Kunne ikke hente data om behandlingen fra backend.</div>;
    }
};

export default BehandlingContainer;
