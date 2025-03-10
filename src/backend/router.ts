import { Client, ensureAuthenticated, logRequest } from '@navikt/familie-backend';
import { NextFunction, Request, Response, Router } from 'express';
import path from 'path';
import { buildPath, eksternlenker, miljø, roller } from './config';
import { prometheusTellere } from './metrikker';
import { LOG_LEVEL } from '@navikt/familie-logging';

export const redirectHvisInternUrlIPreprod = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (
            process.env.ENV === 'preprod' &&
            req.headers.host === 'familie-klage.intern.dev.nav.no'
        ) {
            res.redirect(`https://familie-klage.ansatt.dev.nav.no${req.url}`);
        } else {
            next();
        }
    };
};
export default (authClient: Client, router: Router): Router => {
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

    router.get(
        '*global',
        redirectHvisInternUrlIPreprod(),
        ensureAuthenticated(authClient, false),
        (_req: Request, res: Response) => {
            prometheusTellere.appLoad.inc();

            res.sendFile('index.html', { root: path.join(process.cwd(), buildPath) });
        }
    );

    return router;
};
