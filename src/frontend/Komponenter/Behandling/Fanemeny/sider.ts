export interface ISide {
    href: string;
    navn: string;
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
    },
    {
        href: 'vurdering',
        navn: SideNavn.VURDERING,
    },
    {
        href: 'brev',
        navn: SideNavn.BREV,
    },
    {
        href: 'resultat',
        navn: SideNavn.RESULTAT,
    },
];
