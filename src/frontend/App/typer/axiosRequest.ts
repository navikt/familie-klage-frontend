import type { AxiosRequestConfig } from 'axios';
import type { RessursFeilet, RessursSuksess } from './ressurs';

export type AxiosRequestCallback = <RES, REQ>(
    config: AxiosRequestConfig<REQ>
) => Promise<RessursFeilet | RessursSuksess<RES>>;
