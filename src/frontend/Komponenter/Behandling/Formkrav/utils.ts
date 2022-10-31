import {
    FagsystemVedtak,
    IFormkravVilkår,
    IRadioKnapper,
    Redigeringsmodus,
    VilkårStatus,
} from './typer';
import { PåklagetVedtak, PåklagetVedtakstype } from '../../../App/typer/fagsak';
import { compareDesc } from 'date-fns';
import { formaterIsoDatoTid } from '../../../App/utils/formatter';

export const utledRedigeringsmodus = (
    behandlingErRedigerbar: boolean,
    vurderinger: IFormkravVilkår
): Redigeringsmodus => {
    if (!behandlingErRedigerbar) {
        return Redigeringsmodus.VISNING;
    }
    if (alleVurderingerErStatus(vurderinger, VilkårStatus.IKKE_SATT)) {
        return Redigeringsmodus.IKKE_PÅSTARTET;
    }
    return Redigeringsmodus.VISNING;
};

export const alleVilkårOppfylt = (vurderinger: IFormkravVilkår) => {
    return (
        alleVurderingerErStatus(vurderinger, VilkårStatus.OPPFYLT) &&
        vurderinger.påklagetVedtak.påklagetVedtakstype !== PåklagetVedtakstype.IKKE_VALGT
    );
};

export const alleVurderingerErStatus = (
    formkravVurdering: IFormkravVilkår,
    status: VilkårStatus
): boolean => {
    const { klagePart, klageKonkret, klagefristOverholdt, klageSignert } = formkravVurdering;
    return (
        klagePart === status &&
        klageKonkret === status &&
        klagefristOverholdt === status &&
        klageSignert === status
    );
};

export const utledRadioKnapper = (vurderinger: IFormkravVilkår): IRadioKnapper[] => {
    const { klagePart, klageKonkret, klagefristOverholdt, klageSignert } = vurderinger;
    return [
        {
            spørsmål: 'Er klager part i saken?',
            svar: klagePart,
            navn: 'klagePart',
        },
        {
            spørsmål: 'Klages det på konkrete elementer i vedtaket?',
            svar: klageKonkret,
            navn: 'klageKonkret',
        },
        {
            spørsmål: 'Er klagefristen overholdt?',
            svar: klagefristOverholdt,
            navn: 'klagefristOverholdt',
        },
        {
            spørsmål: 'Er klagen signert?',
            svar: klageSignert,
            navn: 'klageSignert',
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

export const sorterVedtakstidspunktDesc = (a: FagsystemVedtak, b: FagsystemVedtak): number => {
    if (!a.vedtakstidspunkt) {
        return 1;
    } else if (!b.vedtakstidspunkt) {
        return -1;
    }
    return compareDesc(new Date(a.vedtakstidspunkt), new Date(b.vedtakstidspunkt));
};

export const fagsystemVedtakTilVisningstekst = (vedtak: FagsystemVedtak) =>
    `${vedtak.behandlingstype} - ${vedtak.resultat} - ${formaterIsoDatoTid(
        vedtak.vedtakstidspunkt
    )}`;

export const erVedtak = (valgtElement: string) => {
    return !(
        valgtElement === PåklagetVedtakstype.UTEN_VEDTAK ||
        valgtElement === PåklagetVedtakstype.IKKE_VALGT
    );
};
