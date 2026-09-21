import { BodyLong } from '@navikt/ds-react';
import type * as React from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import type { AppEnv } from './App/api/env';
import { hentEnv } from './App/api/env';
import { hentInnloggetBruker } from './App/api/saksbehandler';
import { AppProvider, useApp } from './App/context/AppContext';
import { TogglesProvider } from './App/context/TogglesContext';
import type { ISaksbehandler } from './App/typer/saksbehandler';
import { erLokal } from './App/utils/miljø';
import { ErrorBoundary } from './Felles/ErrorBoundary/ErrorBoundary';
import { HeaderMedSøk } from './Felles/HeaderMedSøk/HeaderMedSøk';
import { IngenBehandlingValgt } from './Felles/IngenBehandlingValgt/IngenBehandlingValgt';
import { ModalWrapper } from './Felles/Modal/ModalWrapper';
import { UlagretDataModal } from './Felles/Modal/UlagretDataModal';
import { Toast } from './Felles/Toast/Toast';
import { BehandlingContainer } from './Komponenter/Behandling/BehandlingContainer';
import { TestSide } from './Komponenter/test/TestSide';

export const App: React.FC = () => {
    const [innloggetSaksbehandler, settInnloggetSaksbehandler] = useState<ISaksbehandler>();
    const [appEnv, settAppEnv] = useState<AppEnv>();

    useEffect(() => {
        hentInnloggetBruker().then((innhentetInnloggetSaksbehandler: ISaksbehandler) => {
            settInnloggetSaksbehandler(innhentetInnloggetSaksbehandler);
        });
    }, []);

    useEffect(() => {
        hentEnv().then((env: AppEnv) => {
            settAppEnv(env);
        });
    }, []);

    if (!innloggetSaksbehandler || !appEnv) {
        return null;
    }
    return (
        <ErrorBoundary>
            <AppProvider autentisertSaksbehandler={innloggetSaksbehandler} appEnv={appEnv}>
                <TogglesProvider>
                    <AppRoutes innloggetSaksbehandler={innloggetSaksbehandler} />
                </TogglesProvider>
            </AppProvider>
        </ErrorBoundary>
    );
};

const AppRoutes: React.FC<{ innloggetSaksbehandler: ISaksbehandler }> = ({ innloggetSaksbehandler }) => {
    const { autentisert } = useApp();

    return (
        <BrowserRouter>
            {autentisert ? (
                <AppInnhold innloggetSaksbehandler={innloggetSaksbehandler} />
            ) : (
                <ModalWrapper
                    tittel={'Ugyldig sesjon'}
                    visModal={true}
                    ariaLabel={'Sesjonen har utløpt. Prøv å last inn siden på nytt.'}
                    width={'30rem'}
                >
                    <BodyLong>Prøv å last siden på nytt</BodyLong>
                </ModalWrapper>
            )}
        </BrowserRouter>
    );
};

const AppInnhold: React.FC<{ innloggetSaksbehandler: ISaksbehandler }> = ({ innloggetSaksbehandler }) => {
    const navigate = useNavigate();
    const { valgtSide, byttUrl, settByttUrl, appEnv } = useApp();

    useEffect(() => {
        if (valgtSide && byttUrl) {
            settByttUrl(false);
            navigate(valgtSide);
        }
    }, [byttUrl, valgtSide]);

    // Dummy-behandlinger skal kun kunne opprettes lokalt, så testruta registreres ikke i andre miljøer.
    const visTestside = erLokal(appEnv);

    return (
        <>
            <HeaderMedSøk innloggetSaksbehandler={innloggetSaksbehandler} />
            <Routes>
                <Route
                    path="/"
                    element={visTestside ? <Navigate to="/test" replace={true} /> : <IngenBehandlingValgt />}
                />
                {visTestside ? <Route path="/test" element={<TestSide />} /> : null}
                <Route path="/behandling/:behandlingId/*" element={<BehandlingContainer />} />
                <Route path="*" element={<IngenBehandlingValgt />} />
            </Routes>
            <UlagretDataModal />
            <Toast />
        </>
    );
};
