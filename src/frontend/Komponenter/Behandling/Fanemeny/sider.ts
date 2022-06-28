import { FunctionComponent } from 'react';
import { Formkrav } from '../Formkrav/Formkrav';

export interface ISide {
    href: string;
    navn: string;
    komponent: FunctionComponent<{ behandlingId: string }>;
}

export enum SideNavn {
    FORMKRAV = 'Formkrav',
}

export const formkrav: ISide = {
    href: 'formkrav',
    navn: SideNavn.FORMKRAV,
    komponent: Formkrav,
};
