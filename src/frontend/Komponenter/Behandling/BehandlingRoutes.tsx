import { Route, Routes } from 'react-router-dom';
import * as React from 'react';
import { Formkrav } from './Formkrav/Formkrav';
import { Brev } from './Brev/Brev';
import { Kabal } from './Kabal/Kabal';
import { Vurdering } from './Vurdering/Vurdering';

interface Props {
    behandlingId: string;
}

const BehandlingRoutes: React.FC<Props> = ({ behandlingId }) => {
    return (
        <Routes>
            <Route path="/formkrav" element={<Formkrav behandlingId={behandlingId} />} />
            <Route path="/vurdering" element={<Vurdering behandlingId={behandlingId} />} />
            <Route path="/brev" element={<Brev />} />
            <Route path="/kabal" element={<Kabal />} />
        </Routes>
    );
};

export default BehandlingRoutes;
