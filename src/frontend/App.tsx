import { BodyLong } from '@navikt/ds-react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import type { AppEnv } from './App/api/env';
import { hentEnv } from './App/api/env';
import { hentInnloggetBruker } from './App/api/saksbehandler';
import { AppProvider, useApp } from './App/context/AppContext';
import { TogglesProvider } from './App/context/TogglesContext';
import type { ISaksbehandler } from './App/typer/saksbehandler';
import { ErrorBoundary } from './Felles/ErrorBoundary/ErrorBoundary';
import { HeaderMedSøk } from './Felles/HeaderMedSøk/HeaderMedSøk';
import { ModalWrapper } from './Felles/Modal/ModalWrapper';
import { UlagretDataModal } from './Felles/Modal/UlagretDataModal';
import { Toast } from './Felles/Toast/Toast';
import { BehandlingContainer } from './Komponenter/Behandling/BehandlingContainer';
import { TestSide } from './Komponenter/test/TestSide';

export const App: React.FC = () => {
    const [innloggetSaksbehandler, settInnloggetSaksbehandler] = useState<ISaksbehandler>();
    const [appEnv, settAppEnv] = useState<AppEnv>();

    React.useEffect(() => {
        hentInnloggetBruker().then((innhentetInnloggetSaksbehandler: ISaksbehandler) => {
            settInnloggetSaksbehandler(innhentetInnloggetSaksbehandler);
        });
    }, []);

    React.useEffect(() => {
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

const AppRoutes: React.FC<{ innloggetSaksbehandler: ISaksbehandler }> = ({
    innloggetSaksbehandler,
}) => {
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

const AppInnhold: React.FC<{ innloggetSaksbehandler: ISaksbehandler }> = ({
    innloggetSaksbehandler,
}) => {
    const navigate = useNavigate();
    const { valgtSide, byttUrl, settByttUrl } = useApp();

    useEffect(() => {
        if (valgtSide && byttUrl) {
            settByttUrl(false);
            navigate(valgtSide);
        }
    }, [byttUrl, valgtSide]);

    return (
        <>
            <HeaderMedSøk innloggetSaksbehandler={innloggetSaksbehandler} />
            <Routes>
                <Route path="/" element={<Navigate to="/test" replace={true} />} />
                <Route path="/test" element={<TestSide />} />
                <Route path="/behandling/:behandlingId/*" element={<BehandlingContainer />} />
            </Routes>
            <UlagretDataModal />
            <Toast />
        </>
    );
};
