import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ClientRequest, IncomingMessage } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { v4 as uuidv4 } from 'uuid';
import { logError, logInfo, stdoutLogger } from '@navikt/familie-logging';
import { TexasClient } from './texas';

const CLUSTER = 'dev-gcp';
export type ApplicationName = 'familie-klage';

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

const harBearerToken = (authorization: string) => {
    return authorization.includes('Bearer ');
};

const utledToken = (authorization: string | undefined) => {
    if (authorization && harBearerToken(authorization)) {
        return authorization.split(' ')[1];
    } else {
        throw Error('Mangler authorization i header');
    }
};

const getAccessToken = async (req: Request, audience: string) => {
    const { authorization } = req.headers;
    const token = utledToken(authorization);

    const texasClient = new TexasClient();

    const accessToken = await texasClient
        .exchangeToken('azuread', audience, token)
        .then((accessToken) => {
            return accessToken.access_token;
        });

    return `Bearer ${accessToken}`;
};

export const attachToken = (applicationName: ApplicationName): RequestHandler => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        const audience = `${CLUSTER}:teamfamilie:${applicationName}`;

        try {
            await getAccessToken(req, audience);
            next();
        } catch (error) {
            if (error === 'invalid_grant') {
                logInfo(`invalid_grant`);
                _res.status(500).json({
                    status: 'IKKE_TILGANG',
                    frontendFeilmelding:
                        'Uventet feil. Det er mulig at du ikke har tilgang til applikasjonen.',
                });
            } else {
                logError(`Uventet feil - getOnBehalfOfAccessToken  ${error}`);
                _res.status(500).json({
                    status: 'FEILET',
                    frontendFeilmelding: 'Uventet feil. Vennligst prøv på nytt.',
                });
            }
        }
    };
};
