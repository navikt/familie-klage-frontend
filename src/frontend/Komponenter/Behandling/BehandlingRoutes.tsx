import { Route, Routes } from 'react-router-dom';
import * as React from 'react';
import { Formkrav } from './Formkrav/Formkrav';

const BehandlingRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/*" element={<Formkrav />} />
        </Routes>
    );
};

export default BehandlingRoutes;
