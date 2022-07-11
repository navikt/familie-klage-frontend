import React from 'react';
import styled from 'styled-components';

import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Ressurs } from '../../../App/typer/ressurs';
import { useMellomlagringBrev } from '../../../App/hooks/useMellomlagringBrev';
import FritekstBrev from './FritekstBrev';

const StyledBrevMeny = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 450px;
`;

export interface IBrevmeny {
    behandlingId: string;
    oppdaterBrevRessurs: (brevRessurs: Ressurs<string>) => void;
}

const Brevmeny: React.FC<IBrevmeny> = ({ behandlingId, oppdaterBrevRessurs }) => {
    return <StyledBrevMeny></StyledBrevMeny>;
};

export default Brevmeny;
