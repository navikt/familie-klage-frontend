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
    //TODO: Når app er klar for prod, kommenter inn de to linjene under og fjern mock av gyldigeSider
    // const { formkravGyldig, vurderingSideGyldig, brevSideGyldig } = useBehandling();
    // const gyldigeSider: boolean[] = [formkravGyldig, vurderingSideGyldig, brevSideGyldig];
    const gyldigeSiderMock: boolean[] = [true, true, true];

    const mock: Ressurs<Behandling> = {
        data: behandling,
        status: RessursStatus.SUKSESS,
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
                            deaktivert={index > 0 ? !gyldigeSiderMock[index - 1] : false}
                            key={index}
                        />
                    ))}
                </StyledFanemeny>
            </StickyMedBoxShadow>
        </DataViewer>
    );
};

export default Fanemeny;
