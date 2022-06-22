import { Navigate, Route, Routes } from 'react-router-dom';
import * as React from 'react';

const BehandlingRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="*" element={<Navigate to={'/velkomstside'} replace={true} />} />
        </Routes>
    );
};

export default BehandlingRoutes;
