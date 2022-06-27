import * as React from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import { formkrav } from './sider';
import { useBehandling } from '../../../App/context/BehandlingContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Sticky } from '../../../Felles/Visningskomponenter/Sticky';
import navFarger from 'nav-frontend-core';
import Fane from './Fane';
import { behandlingMock } from '../BehandlingContainer';
import { RessursStatus } from '../../../App/typer/ressurs';

const StickyMedBoxShadow = styled(Sticky)`
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
`;

const mock = {
    data: behandlingMock,
    status: RessursStatus.SUKSESS,
};

const StyledFanemeny = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    border-bottom: ${navFarger.navGra40} solid 2px;
    background-color: ${navFarger.white};
`;

interface Props {
    behandlingId: string;
}

const Fanemeny: FC<Props> = ({ behandlingId }) => {
    const { behandling } = useBehandling();

    return (
        <DataViewer response={{ mock }}>
            <StickyMedBoxShadow>
                <StyledFanemeny>
                    <Fane
                        side={formkrav}
                        behandlingId={behandlingId}
                        index={0}
                        deaktivert={false}
                        key={0}
                    />
                </StyledFanemeny>
            </StickyMedBoxShadow>
        </DataViewer>
    );
};

export default Fanemeny;
