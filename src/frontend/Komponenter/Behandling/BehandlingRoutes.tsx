import { Route, Routes } from 'react-router-dom';
import * as React from 'react';
import { Formkrav } from './Formkrav/Formkrav';
import { Brev } from './Brev/Brev';
import { Resultat } from './Resultat/Resultat';
import { Vurdering } from './Vurdering/Vurdering';
import { Behandling } from '../../App/typer/fagsak';

interface Props {
    behandling: Behandling;
}

const BehandlingRoutes: React.FC<Props> = ({ behandling }) => {
    return (
        <Routes>
            <Route path="/formkrav" element={<Formkrav behandlingId={behandling.id} />} />
            <Route path="/vurdering" element={<Vurdering behandlingId={behandling.id} />} />
            <Route path="/brev" element={<Brev behandlingId={behandling.id} />} />
            <Route path="/resultat" element={<Resultat behandlingId={behandling.id} />} />
        </Routes>
    );
};

export default BehandlingRoutes;
