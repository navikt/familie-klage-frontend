import { Navigate, Route, Routes } from 'react-router-dom';
import * as React from 'react';
import { Formkrav } from './Formkrav/Formkrav';
import { Resultat } from './Resultat/Resultat';
import { VurderingFane } from './Vurdering/VurderingFane';
import { Behandling } from '../../App/typer/fagsak';
import { BrevFane } from './Brev/BrevFane';
import { utledRedirectUrl } from './utils';

interface Props {
    behandling: Behandling;
}

export const BehandlingRoutes: React.FC<Props> = ({ behandling }) => {
    const redirectUrl = `/behandling/${behandling.id}/${utledRedirectUrl(behandling.steg)}`;

    return (
        <Routes>
            <Route path="/" element={<Navigate to={redirectUrl} replace={true} />} />
            <Route path="/formkrav" element={<Formkrav behandling={behandling} />} />
            <Route path="/vurdering" element={<VurderingFane behandling={behandling} />} />
            <Route path="/brev" element={<BrevFane behandling={behandling} />} />
            <Route path="/resultat" element={<Resultat />} />
            <Route path="*" element={<Navigate to={redirectUrl} replace={true} />} />
        </Routes>
    );
};
