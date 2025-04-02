import { getTokenSetsFromSession } from '@navikt/familie-backend';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ClientRequest, IncomingMessage } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { v4 as uuidv4 } from 'uuid';
import { stdoutLogger } from '@navikt/familie-logging';
import { TexasClient } from './texas';

const restream = (proxyReq: ClientRequest, req: IncomingMessage) => {
    const requestBody = (req as Request).body;
    if (requestBody) {
        const bodyData = JSON.stringify(requestBody);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
    }
};

export const doProxy = (targetUrl: string, pathPrefix = '/api'): RequestHandler => {
    return createProxyMiddleware({
        changeOrigin: true,
        logger: stdoutLogger,
        on: {
            proxyReq: restream,
        },
        pathRewrite: (path: string) => {
            return `${pathPrefix}${path}`;
        },
        secure: true,
        target: `${targetUrl}`,
    });
};

export const addCallId = (): RequestHandler => {
    return (req: Request, _res: Response, next: NextFunction) => {
        req.headers['nav-call-id'] = uuidv4();
        next();
    };
};

export const attachToken = (): RequestHandler => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        const texasClient = new TexasClient();

        getTokenSetsFromSession(req).then((accessToken: string | undefined) => {
            if (accessToken !== undefined) {
                texasClient
                    .exchangeToken(
                        'azuread',
                        'api://dev-gcp.teamfamilie.familie-klage-frontend/.default',
                        accessToken
                    )
                    .then((texasToken) => {
                        if (texasToken !== null) {
                            req.headers.Authorization = `Bearer ${texasToken}`;
                            return next();
                        }
                    });
            } else {
                return;
            }
        });
    };
};
