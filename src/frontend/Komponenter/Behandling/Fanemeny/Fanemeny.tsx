import * as React from 'react';
import { FC, useEffect } from 'react';
import styled from 'styled-components';
import { alleSider } from './sider';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Sticky } from '../../../Felles/Visningskomponenter/Sticky';
import navFarger from 'nav-frontend-core';
import Fane from './Fane';
import { hentBehandlingIdFraUrl } from '../BehandlingContainer';
import { RessursStatus } from '../../../App/typer/ressurs';
import { useHentBehandling } from '../../../App/hooks/useHentBehandling';

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
    // const { behandling } = useBehandling();
    const forrigeSideLagret = false; //Sier hvilke sider som skal være mulige å redigere
    const { behandling, hentBehandlingCallback } = useHentBehandling(hentBehandlingIdFraUrl());

    useEffect(() => {
        hentBehandlingCallback();
    });

    const mock = {
        data: behandling,
        status: RessursStatus,
    };

    return (
        <DataViewer response={{ mock }}>
            <StickyMedBoxShadow>
                <StyledFanemeny>
                    {alleSider.map((side, index) => (
                        <Fane
                            side={side}
                            behandlingId={behandlingId}
                            index={index}
                            deaktivert={forrigeSideLagret}
                            key={index}
                        />
                    ))}
                </StyledFanemeny>
            </StickyMedBoxShadow>
        </DataViewer>
    );
};

export default Fanemeny;
