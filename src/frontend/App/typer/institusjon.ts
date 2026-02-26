export interface Institusjon {
    id: string;
    orgNummer: string;
    navn: string;
}

export function formaterOrgNummer(orgNummer: string): string {
    return `${orgNummer.slice(0, 3)}\u00A0${orgNummer.slice(3, 6)}\u00A0${orgNummer.slice(6, 9)}`;
}
