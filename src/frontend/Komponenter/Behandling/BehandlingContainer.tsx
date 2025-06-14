import * as React from 'react';
import { FC, useEffect } from 'react';
import Høyremeny from './Høyremeny/Høyremeny';
import styled from 'styled-components';
import Fanemeny from './Fanemeny/Fanemeny';
import { ABorderDefault } from '@navikt/ds-tokens/dist/tokens';
import { BehandlingRoutes } from './BehandlingRoutes';
import { BehandlingProvider, useBehandling } from '../../App/context/BehandlingContext';
import VisittkortComponent from '../../Felles/Visittkort/Visittkort';
import { Behandling } from '../../App/typer/fagsak';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import ScrollToTop from '../../Felles/ScrollToTop/ScrollToTop';
import { useSetPersonIdent } from '../../App/hooks/useSetPersonIdent';
import { useSetValgtFagsakId } from '../../App/hooks/useSetValgtFagsakId';
import { SettPåVent } from './SettPåVent/SettPåVent';
import { EndreBehandlendeEnhetModal } from './EndreBehandlendeEnhet/EndreBehandlendeEnhetModal';
import { HenleggBehandlingModal } from './Henleggelse/HenleggBehandlingModal';
import { HenleggModalGammel } from './Henleggelse/HenleggModalGammel';
import { useToggles } from '../../App/context/TogglesContext';
import { ToggleName } from '../../App/context/toggles';

const Container = styled.div`
    display: flex;
    flex-shrink: 2;
    height: calc(100vh - ${97}px); // Magisk tall som er høyden på Header + PersonHeaderComponent
`;

interface InnholdWrapperProps {
    åpenHøyremeny: boolean;
}

interface HøyreMenyWrapperProps {
    åpenHøyremeny: boolean;
}

const HøyreMenyWrapper = styled.div<HøyreMenyWrapperProps>`
    overflow-y: auto;
    border-left: 2px solid ${ABorderDefault};
    flex-shrink: 1;
    flex-grow: 0;
    width: ${(p) => (p.åpenHøyremeny ? '20rem' : '1.5rem')};
    min-width: ${(p) => (p.åpenHøyremeny ? '20rem' : '1.5rem')};
    transition: all 0.25s;
`;

const InnholdWrapper = styled.div<InnholdWrapperProps>`
    overflow-y: auto;
    flex-shrink: 0;
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    max-width: ${(p) => (p.åpenHøyremeny ? 'calc(100% - 20rem)' : '100%')};
    z-index: 9;
`;

const BehandlingContainer: FC = () => {
    return (
        <BehandlingProvider>
            <BehandlingOverbygg />
        </BehandlingProvider>
    );
};

const BehandlingContent: FC<{
    behandling: Behandling;
    personopplysninger: IPersonopplysninger;
}> = ({ behandling, personopplysninger }) => {
    useSetValgtFagsakId(behandling.fagsakId);
    useSetPersonIdent(personopplysninger.personIdent);
    const { åpenHøyremeny } = useBehandling();
    const { toggles } = useToggles();

    return (
        <>
            <ScrollToTop />
            <VisittkortComponent personopplysninger={personopplysninger} behandling={behandling} />
            <Container>
                <InnholdWrapper åpenHøyremeny={åpenHøyremeny} id="scroll-topp">
                    <Fanemeny behandling={behandling} />
                    <SettPåVent behandling={behandling} />
                    <EndreBehandlendeEnhetModal behandling={behandling} />
                    <BehandlingRoutes behandling={behandling} />
                    {toggles[ToggleName.brukNyHenleggBehandlingModal] ? (
                        <HenleggBehandlingModal
                            behandling={behandling}
                            personopplysninger={personopplysninger}
                        />
                    ) : (
                        <HenleggModalGammel
                            behandling={behandling}
                            personopplysninger={personopplysninger}
                        />
                    )}
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
        document.title = 'Klagebehandling';
    }, []);

    return (
        <DataViewer response={{ behandling, personopplysningerResponse }}>
            {({ behandling, personopplysningerResponse }) => (
                <BehandlingContent
                    behandling={behandling}
                    personopplysninger={personopplysningerResponse}
                />
            )}
        </DataViewer>
    );
};

export default BehandlingContainer;
