// Interface

import { kjønnType } from '@navikt/familie-typer';

export interface IPersonopplysninger {
    personId: string;
    navn: string;
    kjønn: kjønnType;
    telefonnummer?: string;
    adresse: string;
}

export interface INavn {
    fornavn: string;
    mellomnavn: string;
    etternavn: string;
    visningsnavn: string;
}

export interface ITelefonnummer {
    landskode: string;
    nummer: string;
}
