import { AvsnittMedId } from './BrevTyper';
import { v4 as uuidv4 } from 'uuid';

export const lagOpprettholdelseBrev = (begrunnelse: string): AvsnittMedId[] => [
    {
        deloverskrift: '',
        innhold: 'Vi har sendt klagen din til NAV Klageinstans',
        avsnittId: uuidv4(),
    },
    {
        deloverskrift: '',
        innhold:
            'Vi har vurdert klagen din på vedtaket om Overgangsstønad, og kommet frem til at vedtaket ikke endres. NAV Klageinstans skal derfor vurdere saken din på nytt.',
        avsnittId: uuidv4(),
    },
    {
        deloverskrift: '',
        innhold: 'Saksbehandlingstidene finner du på nav.no/saksbehandlingstider.',
        avsnittId: uuidv4(),
    },
    {
        deloverskrift: '',
        innhold: `Dette er vurderingen vi har sendt til NAV Klageinstans\n${begrunnelse}`,
        avsnittId: uuidv4(),
    },
    {
        deloverskrift: '',
        innhold:
            'Har du nye opplysninger eller ønsker å uttale deg, kan du sende oss dette via nav.no/klage.',
        avsnittId: uuidv4(),
    },
    {
        deloverskrift: '',
        innhold:
            'Har du spørsmål?\nDu finner informasjon som kan være nyttig for deg på nav.no/familie/alene-med-barn. Du kan også kontakte oss på nav.no/kontakt.',
        avsnittId: uuidv4(),
    },
];

export const avsnittFormkravAvvist: AvsnittMedId[] = [
    {
        deloverskrift: 'Du har rett til å klage',
        innhold:
            'Hvis du vil klage, må du gjøre dette innen 6 uker fra den datoen du fikk dette brevet. Du finner skjema og informasjon på nav.no/klage.',
        avsnittId: uuidv4(),
    },
    {
        deloverskrift: 'Du har rett til innsyn',
        innhold: 'På nav.no/dittnav kan du se dokumentene i saken din.',
        avsnittId: uuidv4(),
    },
    {
        deloverskrift: 'Har du spørsmål?',
        innhold:
            'Du finner nyttig informasjon på nav.no/overgangsstonad-enslig. Du kan også kontakte oss på nav.no/kontakt.',
        avsnittId: uuidv4(),
    },
];
