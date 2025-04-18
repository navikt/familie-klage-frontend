import { Hjemmel } from './hjemmel';
import { Fagsystem } from '../../../App/typer/fagsak';

export interface IVurdering {
    behandlingId: string;
    vedtak?: VedtakValg;
    årsak?: ÅrsakOmgjøring;
    begrunnelseOmgjøring?: string;
    hjemmel?: Hjemmel;
    innstillingKlageinstans?: string;
    dokumentasjonOgUtredning?: string;
    spørsmåletISaken?: string;
    aktuelleRettskilder?: string;
    klagersAnførsler?: string;
    vurderingAvKlagen?: string;
    interntNotat?: string;
}

// VEDTAK
export enum VedtakValg {
    OMGJØR_VEDTAK = 'OMGJØR_VEDTAK',
    OPPRETTHOLD_VEDTAK = 'OPPRETTHOLD_VEDTAK',
}

export const vedtakValgTilTekst: Record<VedtakValg, string> = {
    OMGJØR_VEDTAK: 'Omgjør vedtak',
    OPPRETTHOLD_VEDTAK: 'Oppretthold vedtak',
};

// ÅRSAK
export enum ÅrsakOmgjøring {
    FEIL_I_LOVANDVENDELSE = 'FEIL_I_LOVANDVENDELSE',
    FEIL_REGELVERKSFORSTÅELSE = 'FEIL_REGELVERKSFORSTÅELSE',
    FEIL_ELLER_ENDRET_FAKTA = 'FEIL_ELLER_ENDRET_FAKTA',
    FEIL_PROSESSUELL = 'FEIL_PROSESSUELL',
    IKKE_UTREDET_NOK = 'IKKE_UTREDET_NOK',
    ANNET = 'ANNET',
}

export const årsakValgTilTekst: Record<ÅrsakOmgjøring, string> = {
    FEIL_I_LOVANDVENDELSE: 'Feil lovanvendelse',
    FEIL_REGELVERKSFORSTÅELSE: 'Feil regelverksforståelse',
    FEIL_ELLER_ENDRET_FAKTA: 'Feil eller endret fakta',
    FEIL_PROSESSUELL: 'Prosessuell feil',
    IKKE_UTREDET_NOK: 'Ikke utredet nok',
    ANNET: 'Annet',
};

export const årsakAlternativer: (fagsystem: Fagsystem) => Record<string, string> = (fagsystem) =>
    Object.fromEntries(
        Object.entries(årsakValgTilTekst).filter(
            ([årsak]) => !(fagsystem === Fagsystem.EF && årsak === ÅrsakOmgjøring.IKKE_UTREDET_NOK)
        )
    );
