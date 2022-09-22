import * as React from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import { alleSider, ISide, SideNavn } from './sider';
import { Sticky } from '../../../Felles/Visningskomponenter/Sticky';
import navFarger from 'nav-frontend-core';
import Fane from './Fane';
import { Behandling, behandlingStegTilRekkefølge, StegType } from '../../../App/typer/fagsak';
import { useBehandling } from '../../../App/context/BehandlingContext';

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
    behandling: Behandling;
}

const Fanemeny: FC<Props> = ({ behandling }) => {
    const { vilkårOppfyltOgBesvart } = useBehandling();
    const faneErLåst = (side: ISide, steg: StegType): boolean => {
        if (side.navn === SideNavn.VURDERING) {
            return !vilkårOppfyltOgBesvart;
        }
        return side.rekkefølge > behandlingStegTilRekkefølge[steg];
    };

    return (
        <StickyMedBoxShadow>
            <StyledFanemeny>
                {alleSider.map((side, index) => (
                    <Fane
                        side={side}
                        behandlingId={behandling.id}
                        index={index}
                        deaktivert={faneErLåst(side, behandling.steg)}
                        key={index}
                    />
                ))}
            </StyledFanemeny>
        </StickyMedBoxShadow>
    );
};

export default Fanemeny;
