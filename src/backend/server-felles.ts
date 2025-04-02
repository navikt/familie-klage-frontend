import './konfigurerApp.js';

import { IApp, ensureAuthenticated } from '@navikt/familie-backend';
import bodyParser from 'body-parser';

import { klageProxyUrl } from './config.js';
import { addCallId, attachToken, doProxy } from './proxy.js';
import setupRouter from './router.js';
import { logError, logInfo } from '@navikt/familie-logging';

const port = 8020;

const setupServerFelles = ({ app, azureAuthClient, router }: IApp) => {
    app.use(
        '/familie-klage/api',
        addCallId(),
        ensureAuthenticated(azureAuthClient, true),
        attachToken(),
        doProxy(klageProxyUrl)
    );

    app.use(
        '/dokument',
        addCallId(),
        ensureAuthenticated(azureAuthClient, false),
        attachToken(),
        doProxy(klageProxyUrl)
    );

    // Sett opp bodyParser og router etter proxy. Spesielt viktig med tanke på større payloads som blir parset av bodyParser
    app.use(bodyParser.json({ limit: '200mb' }));
    app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
    app.use('/', setupRouter(azureAuthClient, router));

    app.listen(port, '0.0.0.0', () => {
        logInfo(`server startet på port ${port}. Build version: ${process.env.APP_VERSION}.`);
    }).on('error', (err: Error) => {
        logError(`server startup failed - ${err}`);
    });
};

export default setupServerFelles;
