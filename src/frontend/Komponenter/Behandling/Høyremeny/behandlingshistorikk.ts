export interface IBehandlingshistorikk {
    id: string;
    behandlingId: string;
    steg: Steg;
    opprettetAv: string;
    endretTid: string;
}

export enum Steg {
    OPPRETTET = 'OPPRETTET',
    AVVIST = 'AVVIST',
    GODKJENT = 'GODKJENT',
}

export const stegTilTekst: Record<Steg, string> = {
    OPPRETTET: 'Behandling opprettet',
    AVVIST: 'Behandling avvist',
    GODKJENT: 'Behandling godkjent',
};
