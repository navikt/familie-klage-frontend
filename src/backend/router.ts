import { renderNaisMetaTags } from '@nais/apm';
import type { Client } from '@navikt/familie-backend';
import { ensureAuthenticated, logRequest } from '@navikt/familie-backend';
import { LOG_LEVEL } from '@navikt/familie-logging';
import type { NextFunction, Request, Response, Router } from 'express';
import fs from 'fs';
import path from 'path';
import type { ViteDevServer } from 'vite';
import { eksternlenker, frontendPath, miljø, roller } from './config.js';
import { erLokal, erPreprod } from './env.js';
import { prometheusTellere } from './metrikker.js';

const redirectHvisInternUrlIPreprod = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (erPreprod() && req.headers.host === 'familie-klage.intern.dev.nav.no') {
            res.redirect(`https://familie-klage.ansatt.dev.nav.no${req.url}`);
        } else {
            next();
        }
    };
};

export const setupRouter = async (authClient: Client, router: Router): Promise<Router> => {
    router.get('/version', (_req: Request, res: Response) => {
        res.status(200).send({ version: process.env.APP_VERSION }).end();
    });

    router.get('/env', (_req: Request, res: Response) => {
        res.status(200).send({ roller: roller, miljø: miljø, eksternlenker: eksternlenker }).end();
    });

    router.get('/error', (_req: Request, res: Response) => {
        prometheusTellere.errorRoute.inc();
        res.sendFile('error.html', { root: path.join(`assets/`) });
    });

    router.post('/logg-feil', (req: Request, res: Response) => {
        logRequest(req, req.body.melding, req.body.isWarning ? LOG_LEVEL.WARNING : LOG_LEVEL.ERROR);
        res.status(200).send();
    });

    let viteDevServer: ViteDevServer | undefined;
    if (erLokal()) {
        const { createServer } = await import('vite');
        viteDevServer = await createServer({
            root: path.join(process.cwd(), frontendPath),
            server: { middlewareMode: true },
            appType: 'custom',
        });

        router.use(viteDevServer.middlewares);
    }

    const htmlPath = path.join(process.cwd(), frontendPath, 'index.html');

    router.get(
        '*global',
        redirectHvisInternUrlIPreprod(),
        ensureAuthenticated(authClient, false),
        async (req: Request, res: Response) => {
            prometheusTellere.appLoad.inc();

            if (erLokal()) {
                if (!viteDevServer) {
                    throw new Error('ViteDevServer er ikke initialisert.');
                }
                const htmlInnhold = await leggTilNaisMetaTags(htmlPath);
                const transformed = await viteDevServer.transformIndexHtml(req.url, htmlInnhold);
                res.status(200).type('html').send(transformed);
            } else {
                res.status(200)
                    .type('html')
                    .send(await leggTilNaisMetaTags(htmlPath));
            }
        }
    );

    return router;
};

const leggTilNaisMetaTags = async (htmlPath: string): Promise<string> => {
    const htmlInnhold = await fs.promises.readFile(htmlPath, 'utf-8');
    return htmlInnhold.replace('</head>', `${renderNaisMetaTags()}</head>`);
};
