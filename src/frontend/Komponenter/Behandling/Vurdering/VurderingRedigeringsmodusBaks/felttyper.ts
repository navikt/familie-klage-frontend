import type { Hjemmel } from '../hjemmel';
import type { VedtakValg, ÅrsakOmgjøring } from '../vurderingValg';

export type VurderingSkjemaverdier = VurderingNedtrekkslisteFelter & VurderingTekstfeltFelter;

export type VurderingNedtrekkslisteFelter = {
    vedtak: VedtakValg | '';
    årsak: ÅrsakOmgjøring | '';
    hjemmel: Hjemmel | '';
};

export type VurderingTekstfeltFelter = {
    begrunnelseOmgjøring: string;
    innstillingKlageinstans: string;
    interntNotat: string;
} & VurderingAccordionFelter;

export type VurderingAccordionFelter = {
    dokumentasjonOgUtredning: string;
    spørsmåletISaken: string;
    aktuelleRettskilder: string;
    klagersAnførsler: string;
    vurderingAvKlagen: string;
};
