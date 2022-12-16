import * as React from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import { alleSider, ISide, SideNavn } from './sider';
import { Sticky } from '../../../Felles/Visningskomponenter/Sticky';
import Fane from './Fane';
import {
    Behandling,
    BehandlingResultat,
    behandlingStegTilRekkefølge,
    StegType,
} from '../../../App/typer/fagsak';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { NavdsGlobalColorWhite, NavdsSemanticColorBorder } from '@navikt/ds-tokens/dist/tokens';

const StickyMedBoxShadow = styled(Sticky)`
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
    top: 6rem;
`;

const StyledFanemeny = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    border-bottom: ${NavdsSemanticColorBorder} solid 2px;
    background-color: ${NavdsGlobalColorWhite};
`;

interface Props {
    behandling: Behandling;
}

const Fanemeny: FC<Props> = ({ behandling }) => {
    const { formkravOppfylt } = useBehandling();
    const faneErLåst = (side: ISide, steg: StegType): boolean => {
        if (side.navn === SideNavn.VURDERING) {
            return !formkravOppfylt;
        }
        if (side.navn === SideNavn.BREV && behandling.resultat === BehandlingResultat.HENLAGT) {
            return true;
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
