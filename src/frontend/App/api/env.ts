import type { Eksternlenker } from '../typer/eksternlenker';
import type { Roller } from '../utils/roller';
import { preferredAxios } from './axios';

export interface AppEnv {
    roller: Roller;
    miljø: string;
    eksternlenker: Eksternlenker;
}

export const hentEnv = (): Promise<AppEnv> => {
    return preferredAxios.get(`/env`).then(response => {
        return response.data;
    });
};
