import type { AppEnv } from '../api/env';

// Miljøet settes av backend ut fra ENV-variabelen, se src/backend/config.ts.
// Merk at ENV=lokalt-mot-preprod også rapporteres som `local`.
export const erLokal = (appEnv: AppEnv): boolean => appEnv.miljø === 'local';
