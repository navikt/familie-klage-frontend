import * as React from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import { alleSider } from './sider';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Sticky } from '../../../Felles/Visningskomponenter/Sticky';
import navFarger from 'nav-frontend-core';
import Fane from './Fane';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { Behandling } from '../../../App/typer/fagsak';
import { useBehandling } from '../../../App/context/BehandlingContext';

const StickyMedBoxShadow = styled(Sticky)`
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
    top: 6rem;
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
    behandling: Behandling;
}

const Fanemeny: FC<Props> = ({ behandling }) => {
    const { formkravSteg, vurderingSteg, brevSteg, resultatSteg } = useBehandling();
    const gyldigeSider: boolean[] = [formkravSteg, vurderingSteg, brevSteg, resultatSteg];

    const mock: Ressurs<Behandling> = {
        data: behandling,
        status: RessursStatus.SUKSESS,
    };

    const erFaneLåst = (gyldigeSider: boolean[], index: number) => {
        return !gyldigeSider.slice(index, gyldigeSider.length).includes(true);
    };

    return (
        <DataViewer response={{ mock }}>
            <StickyMedBoxShadow>
                <StyledFanemeny>
                    {alleSider.map((side, index) => (
                        <Fane
                            side={side}
                            behandlingId={behandling.id}
                            index={index}
                            deaktivert={erFaneLåst(gyldigeSider, index)}
                            key={index}
                        />
                    ))}
                </StyledFanemeny>
            </StickyMedBoxShadow>
        </DataViewer>
    );
};

export default Fanemeny;
