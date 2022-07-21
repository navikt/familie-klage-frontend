import { FunctionComponent } from 'react';
import { Formkrav } from '../Formkrav/Formkrav';
import { Vurdering } from '../Vurdering/Vurdering';
import { Brev } from '../Brev/Brev';
import { Resultat } from '../Resultat/Resultat';

export interface ISide {
    href: string;
    navn: string;
    komponent: FunctionComponent<{ behandlingId: string }>;
}

// eslint-disable-next-line prettier/prettier
export enum SideNavn {
    FORMKRAV = 'Formkrav',
    VURDERING = 'Vurdering',
    BREV = 'Brev',
    RESULTAT = 'Resultat',
}

export const alleSider: ISide[] = [
    {
        href: 'formkrav',
        navn: SideNavn.FORMKRAV,
        komponent: Formkrav,
    },
    {
        href: 'vurdering',
        navn: SideNavn.VURDERING,
        komponent: Vurdering,
    },
    {
        href: 'brev',
        navn: SideNavn.BREV,
        komponent: Brev,
    },
    {
        href: 'resultat',
        navn: SideNavn.RESULTAT,
        komponent: Resultat,
    },
];
