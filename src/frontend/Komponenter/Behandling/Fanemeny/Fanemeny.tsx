import * as React from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import { tomSide } from './sider';
import { useBehandling } from '../../../App/context/BehandlingContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Sticky } from '../../../Felles/Visningskomponenter/Sticky';
import navFarger from 'nav-frontend-core';
import Fane from './Fane';

const StickyMedBoxShadow = styled(Sticky)`
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
`;

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
        <DataViewer response={{ behandling }}>
            <StickyMedBoxShadow>
                <StyledFanemeny>
                    <Fane
                        side={tomSide}
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
