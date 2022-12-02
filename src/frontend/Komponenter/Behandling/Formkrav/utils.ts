import { EFormalKravType, FagsystemType, IFormkravVilkår, IFormalkrav } from './typer';
import { PåklagetVedtak, PåklagetVedtakstype } from '../../../App/typer/fagsak';
import { compareDesc } from 'date-fns';
import { formaterIsoDato, formaterIsoDatoTid } from '../../../App/utils/formatter';
import { FagsystemVedtak } from '../../../App/typer/fagsystemVedtak';

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

export const sorterVedtakstidspunktDesc = (a: FagsystemVedtak, b: FagsystemVedtak): number => {
    if (!a.vedtakstidspunkt) {
        return 1;
    } else if (!b.vedtakstidspunkt) {
        return -1;
    }
    return compareDesc(new Date(a.vedtakstidspunkt), new Date(b.vedtakstidspunkt));
};

export const fagsystemVedtakTilVisningstekst = (vedtak: FagsystemVedtak) =>
    `${vedtak.behandlingstype} - ${vedtak.resultat} - ${vedtakstidspunktTilVisningstekst(vedtak)}`;

export const vedtakstidspunktTilVisningstekst = (vedtak: FagsystemVedtak) =>
    vedtak.fagsystemType === FagsystemType.TILBAKEKREVING
        ? formaterIsoDato(vedtak.vedtakstidspunkt)
        : formaterIsoDatoTid(vedtak.vedtakstidspunkt);

export const erVedtak = (valgtElement: string) => {
    return !(
        valgtElement === PåklagetVedtakstype.UTEN_VEDTAK ||
        valgtElement === PåklagetVedtakstype.IKKE_VALGT
    );
};
