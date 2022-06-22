import { FunctionComponent } from 'react';
import { DummyKomponent } from './DummyKomponent';

export interface ISide {
    href: string;
    navn: string;
    komponent: FunctionComponent<{ behandlingId: string }>;
}

export const tomSide: ISide = {
    href: '',
    navn: '',
    komponent: DummyKomponent,
};

export enum SideNavn {}
