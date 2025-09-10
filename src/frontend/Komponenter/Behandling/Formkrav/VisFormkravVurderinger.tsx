import React, { Dispatch, SetStateAction, useState } from 'react';
import styles from './VisFormkravVurderinger.module.css';
import { BrukerMedBlyant } from '../../../Felles/Ikoner/BrukerMedBlyant';
import {
    formkravFristUnntakTilTekst,
    IFormalkrav,
    IFormkravVilkår,
    Redigeringsmodus,
    VilkårStatus,
    vilkårStatusTilTekst,
} from './typer';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Alert, BodyShort, Heading, HStack, Label, VStack } from '@navikt/ds-react';
import {
    formaterIsoDatoTid,
    formaterNullableIsoDato,
    formaterNullableIsoDatoTid,
} from '../../../App/utils/formatter';
import { Ressurs, RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import {
    harManuellVedtaksdato,
    skalViseKlagefristUnntak,
    utledFagsystemVedtakFraPåklagetVedtak,
    utledKlageresultatFraPåklagetVedtak,
    utledRadioKnapper,
    vedtakstidspunktTilVisningstekst,
} from './utils';
import { PencilIcon, TrashIcon } from '@navikt/aksel-icons';
import {
    behandlingResultatTilTekst,
    PåklagetVedtakstype,
    påklagetVedtakstypeTilTekst,
} from '../../../App/typer/fagsak';
import {
    alleVilkårOppfylt,
    begrunnelseUtfylt,
    brevtekstUtfylt,
    klagefristUnntakTattStillingTil,
    påklagetVedtakErValgt,
    utledIkkeUtfylteVilkår,
} from './validerFormkravUtils';
import { FagsystemVedtak } from '../../../App/typer/fagsystemVedtak';
import { Klagebehandlingsresultat } from '../../../App/typer/klagebehandlingsresultat';
import { Button } from '../../../Felles/Knapper/Button';
import { useApp } from '../../../App/context/AppContext';

interface Props {
    fagsystemVedtak: FagsystemVedtak[];
    lagreVurderinger: (
        vurderinger: IFormkravVilkår
    ) => Promise<RessursSuksess<IFormkravVilkår> | RessursFeilet>;
    settRedigeringsmodus: (redigeringsmodus: Redigeringsmodus) => void;
    settOppdaterteVurderinger: Dispatch<SetStateAction<IFormkravVilkår>>;
    vurderinger: IFormkravVilkår;
    klagebehandlingsresultater: Klagebehandlingsresultat[];
}

export const VisFormkravVurderinger: React.FC<Props> = ({
    fagsystemVedtak,
    lagreVurderinger,
    settOppdaterteVurderinger,
    settRedigeringsmodus,
    vurderinger,
    klagebehandlingsresultater,
}) => {
    const { gåTilUrl } = useApp();
    const { behandlingErRedigerbar, hentBehandling, hentBehandlingshistorikk } = useBehandling();
    const { påklagetVedtakstype, manuellVedtaksdato } = vurderinger.påklagetVedtak;
    const [nullstillerVurderinger, settNullstillerVurderinger] = useState<boolean>(false);

    const nullstillVurderinger = () => {
        if (nullstillerVurderinger) {
            return;
        }
        settNullstillerVurderinger(true);

        const nullstilteVurderinger: IFormkravVilkår = {
            ...vurderinger,
            klagePart: VilkårStatus.IKKE_SATT,
            klageKonkret: VilkårStatus.IKKE_SATT,
            klagefristOverholdt: VilkårStatus.IKKE_SATT,
            klageSignert: VilkårStatus.IKKE_SATT,
            saksbehandlerBegrunnelse: undefined,
            brevtekst: undefined,
            påklagetVedtak: {
                påklagetVedtakstype: PåklagetVedtakstype.IKKE_VALGT,
            },
        };

        lagreVurderinger(nullstilteVurderinger).then((res: Ressurs<IFormkravVilkår>) => {
            settNullstillerVurderinger(false);
            if (res.status === RessursStatus.SUKSESS) {
                settOppdaterteVurderinger(nullstilteVurderinger);
                settRedigeringsmodus(Redigeringsmodus.IKKE_PÅSTARTET);
                hentBehandling.rerun();
                hentBehandlingshistorikk.rerun();
            }
        });
    };

    const radioKnapper = utledRadioKnapper(vurderinger);
    const alleVilkårErOppfylt = alleVilkårOppfylt(vurderinger);
    const påKlagetVedtakErValgt = påklagetVedtakErValgt(vurderinger);
    const harBegrunnelse = begrunnelseUtfylt(vurderinger);
    const harBrevtekst = brevtekstUtfylt(vurderinger);
    const manglerFritekster = !harBrevtekst || !harBegrunnelse;
    const ikkeUtfylteVilkår = utledIkkeUtfylteVilkår(vurderinger);
    const unntakFormalkravTattStillingTil = klagefristUnntakTattStillingTil(vurderinger);
    const ikkePåklagetVedtak =
        vurderinger.påklagetVedtak.påklagetVedtakstype === PåklagetVedtakstype.UTEN_VEDTAK;

    const utledManglerUtfylling = () => {
        if (ikkePåklagetVedtak) {
            return manglerFritekster;
        }
        return (
            !påKlagetVedtakErValgt ||
            ikkeUtfylteVilkår.length > 0 ||
            !unntakFormalkravTattStillingTil ||
            (!alleVilkårErOppfylt && manglerFritekster)
        );
    };

    const manglerUtfylling = utledManglerUtfylling();

    const utledUrlSuffiks = (): string => {
        if (!behandlingErRedigerbar) {
            return '';
        }
        if (manglerUtfylling) {
            return '';
        }
        return alleVilkårErOppfylt ? 'vurdering' : 'brev';
    };

    const gjeldendeFagsystemVedtak = utledFagsystemVedtakFraPåklagetVedtak(
        fagsystemVedtak,
        vurderinger.påklagetVedtak
    );

    const gjeldendeKlageresultat = utledKlageresultatFraPåklagetVedtak(
        klagebehandlingsresultater,
        vurderinger.påklagetVedtak
    );

    const urlSuffiks = utledUrlSuffiks();

    const skalViseBegrunnelseOgBrevtekst = !alleVilkårErOppfylt || ikkePåklagetVedtak;

    return (
        <VStack>
            <HStack justify="space-between">
                <HStack align="center">
                    <BrukerMedBlyant className={styles.ikon} heigth={23} width={23} />
                    <Heading spacing size={'medium'}>
                        {alleVilkårErOppfylt ? 'Vilkår oppfylt' : 'Vilkår ikke oppfylt'}
                    </Heading>
                </HStack>
                {behandlingErRedigerbar && (
                    <div>
                        <Button
                            variant={'tertiary'}
                            icon={<PencilIcon fontSize="1.5rem" />}
                            onClick={() => settRedigeringsmodus(Redigeringsmodus.REDIGERING)}
                        >
                            <span>Rediger</span>
                        </Button>
                        <Button
                            onClick={() => nullstillVurderinger()}
                            variant={'tertiary'}
                            icon={<TrashIcon fontSize="1.5rem" />}
                        >
                            <span>Slett</span>
                        </Button>
                    </div>
                )}
            </HStack>
            <div className={styles.spørsmålContainer}>
                Sist endret - {formaterIsoDatoTid(vurderinger.endretTid)}
                <div className={styles.spørsmålSvar}>
                    <li className={styles.spørsmål}>Vedtak som er påklaget</li>
                    <li className={styles.svar}>
                        {gjeldendeFagsystemVedtak ? (
                            <div>
                                <div>{gjeldendeFagsystemVedtak.behandlingstype}</div>
                                <div>
                                    {gjeldendeFagsystemVedtak.resultat} -{' '}
                                    {vedtakstidspunktTilVisningstekst(gjeldendeFagsystemVedtak)}
                                </div>
                            </div>
                        ) : gjeldendeKlageresultat ? (
                            <div>
                                <div>Klage</div>
                                <div>
                                    {behandlingResultatTilTekst[gjeldendeKlageresultat.resultat]} -{' '}
                                    {formaterNullableIsoDatoTid(gjeldendeKlageresultat.vedtaksdato)}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div>{påklagetVedtakstypeTilTekst[påklagetVedtakstype]}</div>
                                <div>
                                    {harManuellVedtaksdato(påklagetVedtakstype)
                                        ? formaterNullableIsoDato(manuellVedtaksdato)
                                        : ''}
                                </div>
                            </div>
                        )}
                    </li>
                </div>
                {!ikkePåklagetVedtak && (
                    <>
                        {radioKnapper.map((knapp: IFormalkrav, index) => (
                            <>
                                <div className={styles.spørsmålSvar} key={index}>
                                    <li className={styles.spørsmål}>{knapp.spørsmål}</li>
                                    <li>{vilkårStatusTilTekst[knapp.svar]}</li>
                                </div>
                                {skalViseKlagefristUnntak(knapp) && (
                                    <div className={styles.spørsmålSvar} key={'unntaksvilkår'}>
                                        <li className={styles.spørsmål}>
                                            Er unntak for klagefristen oppfylt?
                                        </li>
                                        <li className={styles.svar}>
                                            {
                                                formkravFristUnntakTilTekst[
                                                    vurderinger.klagefristOverholdtUnntak
                                                ]
                                            }
                                        </li>
                                    </div>
                                )}
                            </>
                        ))}
                    </>
                )}
                {skalViseBegrunnelseOgBrevtekst && (
                    <>
                        <div className={styles.spørsmålSvar}>
                            <li className={styles.spørsmål}>Begrunnelse (intern)</li>
                            <li className={styles.svar}>
                                <div className={styles.fritekstContainer}>
                                    {vurderinger.saksbehandlerBegrunnelse}
                                </div>
                            </li>
                        </div>
                        <div className={styles.spørsmålSvar}>
                            <li className={styles.spørsmål}>Fritekst til brev</li>
                            <li className={styles.svar}>
                                <div className={styles.fritekstContainer}>
                                    {vurderinger.brevtekst}
                                </div>
                            </li>
                        </div>
                    </>
                )}
                {urlSuffiks && (
                    <Button
                        variant="primary"
                        size="medium"
                        onClick={() =>
                            gåTilUrl(`/behandling/${vurderinger.behandlingId}/${urlSuffiks}`)
                        }
                    >
                        Fortsett
                    </Button>
                )}
            </div>
            {manglerUtfylling && (
                <Alert className={styles.alert} variant={'error'}>
                    <Label>Følgende vilkår er ikke utfylt:</Label>
                    <ul>
                        {!påKlagetVedtakErValgt && <li>Ikke valgt påklaget vedtak</li>}
                        {!ikkePåklagetVedtak && (
                            <>
                                {ikkeUtfylteVilkår.map((vilkår, index) => {
                                    return (
                                        <li key={index}>
                                            <BodyShort key={vilkår.navn}>
                                                {vilkår.spørsmål}
                                            </BodyShort>
                                        </li>
                                    );
                                })}
                                {!unntakFormalkravTattStillingTil && (
                                    <li>
                                        <BodyShort key="unntakFrist">
                                            Unntak for ikke overholdt frist ikke utfylt
                                        </BodyShort>
                                    </li>
                                )}
                            </>
                        )}
                        {!harBegrunnelse && <li>Begrunnelse er ikke utfylt</li>}
                        {!harBrevtekst && <li>Fritekst til brev er ikke utfylt</li>}
                    </ul>
                </Alert>
            )}
        </VStack>
    );
};
