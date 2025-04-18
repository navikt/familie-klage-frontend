import {
    EFormalKravType,
    FagsystemType,
    FormkravFristUnntak,
    IFormalkrav,
    IFormkravVilkår,
    PåklagetVedtak,
    VilkårStatus,
} from './typer';
import { PåklagetVedtakstype } from '../../../App/typer/fagsak';
import { compareDesc } from 'date-fns';
import {
    formaterIsoDato,
    formaterIsoDatoTid,
    formaterNullableIsoDatoTid,
} from '../../../App/utils/formatter';
import { FagsystemVedtak } from '../../../App/typer/fagsystemVedtak';
import { alleVilkårOppfylt, klagefristUnntakErValgtOgOppfylt } from './validerFormkravUtils';
import { Klagebehandlingsresultat } from '../../../App/typer/klagebehandlingsresultat';

export const utledRadioKnapper = (vurderinger: IFormkravVilkår): IFormalkrav[] => {
    const { klagePart, klageKonkret, klagefristOverholdt, klageSignert } = vurderinger;
    return [
        {
            spørsmål: 'Er klager part i saken?',
            svar: klagePart,
            navn: 'klagePart',
            type: EFormalKravType.KLAGER_ER_PART,
        },
        {
            spørsmål: 'Klages det på konkrete elementer i vedtaket?',
            svar: klageKonkret,
            navn: 'klageKonkret',
            type: EFormalKravType.KLAGES_PÅ_KONKRET_ELEMENT_I_VEDTAK,
        },
        {
            spørsmål: 'Er klagefristen overholdt?',
            svar: klagefristOverholdt,
            navn: 'klagefristOverholdt',
            type: EFormalKravType.KLAGEFRIST_OVERHOLDT,
        },
        {
            spørsmål: 'Er klagen signert?',
            svar: klageSignert,
            navn: 'klageSignert',
            type: EFormalKravType.KLAGE_SIGNERT,
        },
    ];
};

export const utledFagsystemVedtakFraPåklagetVedtak = (
    fagsystemVedtak: FagsystemVedtak[],
    påklagetVedtak: PåklagetVedtak
) => {
    return fagsystemVedtak.find(
        (vedtak) => vedtak.eksternBehandlingId === påklagetVedtak.eksternFagsystemBehandlingId
    );
};

export const utledKlageresultatFraPåklagetVedtak = (
    klagebehandlingsresultater: Klagebehandlingsresultat[],
    påklagetVedtak: PåklagetVedtak
) => {
    return klagebehandlingsresultater.find(
        (klagebehandlingsresultat) =>
            klagebehandlingsresultat.id === påklagetVedtak.internKlagebehandlingId
    );
};

export const sorterVedtakstidspunktDesc = (a: FagsystemVedtak, b: FagsystemVedtak): number => {
    if (!a.vedtakstidspunkt) {
        return 1;
    } else if (!b.vedtakstidspunkt) {
        return -1;
    }
    return compareDesc(new Date(a.vedtakstidspunkt), new Date(b.vedtakstidspunkt));
};

export const sorterVedtakstidspunktKlageResultatDesc = (
    a: Klagebehandlingsresultat,
    b: Klagebehandlingsresultat
): number => {
    if (!a.vedtaksdato) {
        return 1;
    } else if (!b.vedtaksdato) {
        return -1;
    }
    return compareDesc(new Date(a.vedtaksdato), new Date(b.vedtaksdato));
};

export const fagsystemVedtakTilVisningstekst = (vedtak: FagsystemVedtak) =>
    `${vedtak.behandlingstype} - ${vedtak.resultat} - ${vedtakstidspunktTilVisningstekst(vedtak)}`;

export const klageresultatTilVisningstekst = (klage: Klagebehandlingsresultat) =>
    `Avvist klage - ${formaterNullableIsoDatoTid(klage.vedtaksdato)}`;

export const vedtakstidspunktTilVisningstekst = (vedtak: FagsystemVedtak) =>
    vedtak.fagsystemType === FagsystemType.TILBAKEKREVING
        ? formaterIsoDato(vedtak.vedtakstidspunkt)
        : formaterIsoDatoTid(vedtak.vedtakstidspunkt);

export const erVedtakFraFagsystemet = (valgtElement: string) => {
    return !(
        valgtElement === PåklagetVedtakstype.UTEN_VEDTAK ||
        valgtElement === PåklagetVedtakstype.IKKE_VALGT ||
        valgtElement === PåklagetVedtakstype.INFOTRYGD_TILBAKEKREVING ||
        valgtElement === PåklagetVedtakstype.UTESTENGELSE ||
        valgtElement === PåklagetVedtakstype.INFOTRYGD_ORDINÆRT_VEDTAK
    );
};

export const skalViseKlagefristUnntak = (vilkår: IFormalkrav) => {
    const { type, svar } = vilkår;
    return svar === VilkårStatus.IKKE_OPPFYLT && type === EFormalKravType.KLAGEFRIST_OVERHOLDT;
};

const tilbakestilteVilkår = {
    klagePart: VilkårStatus.IKKE_SATT,
    klageKonkret: VilkårStatus.IKKE_SATT,
    klageSignert: VilkårStatus.IKKE_SATT,
    klagefristOverholdt: VilkårStatus.IKKE_SATT,
    klagefristOverholdtUnntak: FormkravFristUnntak.IKKE_SATT,
};

export const evaluerOmFelterSkalTilbakestilles = (vurderinger: IFormkravVilkår) => {
    if (vurderinger.påklagetVedtak.påklagetVedtakstype === PåklagetVedtakstype.IKKE_VALGT) {
        return {
            ...vurderinger,
            ...tilbakestilteVilkår,
            saksbehandlerBegrunnelse: undefined,
            brevtekst: undefined,
        };
    }

    const tilbakestillFormkrav =
        vurderinger.påklagetVedtak.påklagetVedtakstype === PåklagetVedtakstype.UTEN_VEDTAK
            ? {
                  ...vurderinger,
                  ...tilbakestilteVilkår,
              }
            : vurderinger;

    const alleVilkårErOppfylt = alleVilkårOppfylt(tilbakestillFormkrav);
    const klagefristUnntakOppfylt = klagefristUnntakErValgtOgOppfylt(
        vurderinger.klagefristOverholdtUnntak
    );

    const tilbakestillFritekstfelter =
        alleVilkårErOppfylt && !klagefristUnntakOppfylt
            ? { ...tilbakestillFormkrav, saksbehandlerBegrunnelse: '', brevtekst: undefined }
            : tilbakestillFormkrav;

    const tilbakestillUnntak =
        vurderinger.klagefristOverholdt === VilkårStatus.OPPFYLT
            ? {
                  ...tilbakestillFritekstfelter,
                  klagefristOverholdtUnntak: FormkravFristUnntak.IKKE_SATT,
              }
            : tilbakestillFritekstfelter;

    return tilbakestillUnntak;
};

export const harManuellVedtaksdato = (påklagetVedtakstype: PåklagetVedtakstype): boolean =>
    [
        PåklagetVedtakstype.INFOTRYGD_TILBAKEKREVING,
        PåklagetVedtakstype.UTESTENGELSE,
        PåklagetVedtakstype.INFOTRYGD_ORDINÆRT_VEDTAK,
    ].includes(påklagetVedtakstype);

export const erKlageTest = (påklagetVedtakstype: PåklagetVedtakstype): boolean =>
    [PåklagetVedtakstype.AVVIST_KLAGE].includes(påklagetVedtakstype);
