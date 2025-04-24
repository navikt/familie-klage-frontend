import { logger } from '@sentry/core';

export type Miljøvariabel =
    | 'SESSION_SECRET'
    | 'NAIS_TOKEN_INTROSPECTION_ENDPOINT'
    | 'NAIS_TOKEN_EXCHANGE_ENDPOINT';

export const utledMiljøvariabel = (
    navn: Miljøvariabel,
    påkrevd = true,
    defaultValue?: string
): string => {
    const miljøVariabel = process.env[navn];

    if (!miljøVariabel && påkrevd && !defaultValue) {
        logger.error(`Klarte ikke å finne miljøvariabel: ${navn}`);
        throw Error(`Klarte ikke å finne env miljøvariabel: ${navn}`);
    }

    if (!miljøVariabel && defaultValue) {
        return defaultValue;
    } else {
        return miljøVariabel as string;
    }
};
