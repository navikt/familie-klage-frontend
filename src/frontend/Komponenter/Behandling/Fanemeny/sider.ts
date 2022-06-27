import { FunctionComponent } from 'react';
import { Formkrav } from '../Formkrav/Formkrav';

export interface ISide {
    href: string;
    navn: string;
    komponent: FunctionComponent<{ behandlingId: string }>;
}

export const formkrav: ISide = {
    href: '',
    navn: '',
    komponent: Formkrav,
};

// eslint-disable-next-line prettier/prettier
export enum SideNavn {}
