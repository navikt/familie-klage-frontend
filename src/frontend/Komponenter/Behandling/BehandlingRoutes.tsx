import { Navigate, Route, Routes } from 'react-router-dom';
import * as React from 'react';
import { Formkrav } from './Formkrav/Formkrav';
import { Resultat } from './Resultat/Resultat';
import { Vurdering } from './Vurdering/Vurdering';
import { Behandling, StegType } from '../../App/typer/fagsak';
import { BrevFane } from './Brev/BrevFane';

interface Props {
    behandling: Behandling;
}

export const BehandlingRoutes: React.FC<Props> = ({ behandling }) => {
    const utledRedirectUrl = (): string => {
        switch (behandling.steg) {
            case StegType.FORMKRAV:
                return 'formkrav';
            case StegType.VURDERING:
                return 'vurdering';
            case StegType.BREV:
                return 'brev';
            default:
                return 'resultat';
        }
    };

    const redirectUrl = `/behandling/${behandling.id}/${utledRedirectUrl()}`;

    return (
        <Routes>
            <Route path="/" element={<Navigate to={redirectUrl} replace={true} />} />
            <Route path="/formkrav" element={<Formkrav behandling={behandling} />} />
            <Route path="/vurdering" element={<Vurdering behandlingId={behandling.id} />} />
            <Route path="/brev" element={<BrevFane behandling={behandling} />} />
            <Route path="/resultat" element={<Resultat />} />
        </Routes>
    );
};
