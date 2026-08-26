import React from 'react';
import { App } from './App';
import '@navikt/ds-css';
import { createRoot } from 'react-dom/client';
import { init } from '@nais/apm';

if (!import.meta.env.DEV) {
    init();
}

// Oppdater denne ved endringer som krever å nullstille localStorage
(function () {
    try {
        if (window.localStorage.getItem('oppgaveRequestVersjon') !== 'v1') {
            localStorage.clear();
            localStorage.setItem('oppgaveRequestVersjon', 'v1');
        }
    } catch {
        // Never mind
    }
})();

const rootElement = document.getElementById('app');

const root = createRoot(rootElement!);
root.render(<App />);
