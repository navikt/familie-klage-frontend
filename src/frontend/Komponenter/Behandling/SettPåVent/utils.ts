import { BeskrivelseHistorikkInnslag } from './BeskrivelseHistorikk';

export const splitBeskrivelser = (beskrivelse: string): BeskrivelseHistorikkInnslag[] => {
    return beskrivelse.split('\n\n').map((entry) => {
        const [header, ...details] = entry.split('\n');
        return {
            endringDato: header,
            endringDetaljer: details,
        };
    });
};
