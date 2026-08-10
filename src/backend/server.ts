import './konfigurerApp.js';

import type { IApp } from '@navikt/familie-backend';
import backend, { ensureAuthenticated } from '@navikt/familie-backend';
import express from 'express';
import expressStaticGzip from 'express-static-gzip';
import path from 'path';

import { frontendPath, klageProxyUrl, sessionConfig } from './config.js';
import { erLokal } from './env.js';
import { prometheusTellere } from './metrikker.js';
import { addCallId, attachToken, doProxy } from './proxy.js';
import { setupRouter } from './router.js';
import { logError, logInfo } from '@navikt/familie-logging';

const port = 8020;

backend(sessionConfig, prometheusTellere).then(async ({ app, azureAuthClient, router }: IApp) => {
    logInfo(`Starter opp med miljø: ${process.env.ENV}`);
    logInfo(`Starter opp med frontendPath: ${frontendPath}`);

    if (!erLokal()) {
        app.use('/assets', expressStaticGzip(path.join(process.cwd(), frontendPath, 'assets'), {}));
        app.use(
            '/favicon.ico',
            express.static(path.join(process.cwd(), frontendPath, 'favicon.ico'))
        );
    }

    app.use(
        '/familie-klage/api',
        addCallId(),
        ensureAuthenticated(azureAuthClient, true),
        attachToken(azureAuthClient),
        doProxy(klageProxyUrl)
    );

    app.use(
        '/dokument',
        addCallId(),
        ensureAuthenticated(azureAuthClient, false),
        attachToken(azureAuthClient),
        doProxy(klageProxyUrl)
    );

    app.use(express.json({ limit: '200mb' }));
    app.use(express.urlencoded({ limit: '200mb', extended: true }));
    app.use('/', await setupRouter(azureAuthClient, router));

    app.listen(port, '0.0.0.0', () => {
        logInfo(`server startet på port ${port}. Build version: ${process.env.APP_VERSION}.`);
    }).on('error', (err: Error) => {
        logError(`server startup failed - ${err}`);
    });
});
