import { VedtakValg, ÅrsakOmgjøring } from '../vurderingValg';
import { Hjemmel } from '../hjemmel';

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
