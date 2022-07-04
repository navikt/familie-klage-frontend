import { Route, Routes } from 'react-router-dom';
import * as React from 'react';
import { Formkrav } from './Formkrav/Formkrav';
import { Brev } from './Brev/Brev';
import { Kabal } from './Kabal/Kabal';
import { Vurdering } from './Vurdering/Vurdering';

const BehandlingRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/formkrav" element={<Formkrav />} />
            <Route path="/vurdering" element={<Vurdering />} />
            <Route path="/brev" element={<Brev />} />
            <Route path="/kabal" element={<Kabal />} />
        </Routes>
    );
};

export default BehandlingRoutes;
