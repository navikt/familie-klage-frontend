import { utledMiljøvariabel } from './util';
import axios from 'axios';
import { logger } from '@sentry/core';
import { Request } from 'express';

interface ValidTokenResponse {
    active: boolean;
    aud: string;
    azp: string;
    exp: number;
    iat: number;
    iss: string;
    jti: string;
    nbf: number;
    sub: string;
    tid: string;
}

interface InvalidTokenResponse {
    active: boolean;
    error: string;
}

interface ExchangeTokenResponse {
    expires_in: string;
    token_type: string;
    access_token: string;
}

type TokenResponse = ValidTokenResponse | InvalidTokenResponse;

const postRequest = async <T>(url: string, data: object): Promise<T> => {
    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        logger.error(`Request mot ${url} feilet.`, error);
        throw error;
    }
};

export const exchangeToken = async (
    identityProvider: string,
    target: string,
    token: string
): Promise<ExchangeTokenResponse> => {
    const exchangeTokenUrl = utledMiljøvariabel('NAIS_TOKEN_EXCHANGE_ENDPOINT');

    const requestBody = {
        identity_provider: identityProvider,
        target: target,
        user_token: token,
    };

    return await postRequest<ExchangeTokenResponse>(exchangeTokenUrl, requestBody);
};

export const validateToken = async (
    identityProvider: string,
    token: string
): Promise<TokenResponse> => {
    const validateTokenUrl = utledMiljøvariabel('NAIS_TOKEN_INTROSPECTION_ENDPOINT');

    const requestBody = {
        identity_provider: identityProvider,
        token: token,
    };

    return await postRequest<TokenResponse>(validateTokenUrl, requestBody);
};

export const attachToken = async (req: Request, entraIdToken: string) => {
    await exchangeToken(
        'azuread',
        'api://dev-gcp.teamfamilie.familie-ef-sak/.default',
        entraIdToken
    )
        .then((accessTokenResponse) => {
            req.headers['authorization'] = `Bearer ${accessTokenResponse.access_token}`;
        })
        .catch((error) => {
            logger.error(`Klarte ikke å attache token til Authorization header.`, error);
            throw Error;
        });
};
