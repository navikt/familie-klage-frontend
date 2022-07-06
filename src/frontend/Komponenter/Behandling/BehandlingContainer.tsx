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
import { useHentBehandling } from '../../App/hooks/useHentBehandling';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import { kjønnType } from '@navikt/familie-typer';

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

const hentBehandlingIdFraUrl = (): string => {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    personopplysninger: IPersonopplysninger;
}> = ({ behandling, personopplysninger }) => {
    useSetValgtFagsakId(behandling.fagsakId);
    const { åpenHøyremeny } = useBehandling();

    return (
        <>
            <VisittkortComponent data={personopplysninger} behandling={behandling} />
            <Container>
                <InnholdWrapper åpenHøyremeny={åpenHøyremeny}>
                    <Fanemeny behandlingId={behandling.id} />
                    <BehandlingRoutes behandlingId={behandling.id} />
                </InnholdWrapper>
                <HøyreMenyWrapper åpenHøyremeny={åpenHøyremeny}>
                    <Høyremeny åpenHøyremeny={åpenHøyremeny} behandlingId={behandling.id} />
                </HøyreMenyWrapper>
            </Container>
        </>
    );
};

const person: IPersonopplysninger = {
    personIdent: '1',
    navn: {
        fornavn: 'Juni',
        mellomnavn: 'Leirvik',
        etternavn: 'Larsen',
        visningsnavn: 'Juni Leirvik',
    },
    kjønn: kjønnType.KVINNE,
    adresse: 'Uelands gate 32',
};

const BehandlingOverbygg: FC = () => {
    const { hentBehandlingCallback, behandling } = useHentBehandling(hentBehandlingIdFraUrl());

    useEffect(() => {
        hentBehandlingCallback();
        document.title = 'Behandling';
    }, [hentBehandlingCallback]);
    if (behandling.status === 'SUKSESS') {
        return <BehandlingContent behandling={behandling.data} personopplysninger={person} />;
    } else {
        return <div>Kunne ikke hente data om behandlingen fra backend.</div>;
    }
};

export default BehandlingContainer;
