import React, { FC } from 'react';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import { Visittkort as FamilieVisittkort } from '@navikt/familie-visittkort';
import styles from './Visittkort.module.css';
import {
    Behandling,
    Klagebehandlingsårsak,
    klagebehandlingsårsakTilTekst,
    PåklagetVedtakstype,
} from '../../App/typer/fagsak';
import { HenleggKnapp } from './HenleggKnapp';
import { HStack, Label, Link } from '@navikt/ds-react';
import PersonStatusVarsel from '../Varsel/PersonStatusVarsel';
import AdressebeskyttelseVarsel from '../Varsel/AdressebeskyttelseVarsel';
import { EtikettFokus, EtikettInfo, EtikettSuksess } from '../Varsel/Etikett';
import { erEtterDagensDato } from '../../App/utils/dato';
import { stønadstypeTilTekst } from '../../App/typer/stønadstype';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import {
    utledBehandlingLenke,
    utledSaksoversiktLenke,
    utledTilbakekrevingLenke,
} from '../../App/utils/utils';
import { useApp } from '../../App/context/AppContext';
import { FagsystemType } from '../../Komponenter/Behandling/Formkrav/typer';
import { SettPåVentKnapp } from './SettPåVentKnapp';
import { EndreBehandlendeEnhetKnapp } from './EndreBehandlendeEnhetKnapp';

export const Visittkort: FC<{
    personopplysninger: IPersonopplysninger;
    behandling: Behandling;
}> = ({ personopplysninger, behandling }) => {
    const { appEnv } = useApp();

    const {
        personIdent,
        kjønn,
        navn,
        folkeregisterpersonstatus,
        adressebeskyttelse,
        egenAnsatt,
        fullmakt,
        vergemål,
    } = personopplysninger;
    const skalLenkeTilFagsystemBehandling =
        behandling.påklagetVedtak.påklagetVedtakstype === PåklagetVedtakstype.VEDTAK &&
        behandling.påklagetVedtak.fagsystemVedtak?.fagsystemType === FagsystemType.ORDNIÆR;
    const skalLenkeTilTilbakekreving =
        behandling.påklagetVedtak.påklagetVedtakstype === PåklagetVedtakstype.VEDTAK &&
        behandling.påklagetVedtak.fagsystemVedtak?.fagsystemType === FagsystemType.TILBAKEKREVING;
    const behandlingLenke = utledBehandlingLenke(behandling, appEnv.eksternlenker);
    const saksoversiktLenke = utledSaksoversiktLenke(behandling, appEnv.eksternlenker);
    const tilbakekrevingLenke = utledTilbakekrevingLenke(behandling, appEnv.eksternlenker);

    return (
        <div className={styles.container}>
            <FamilieVisittkort
                borderBottom={false}
                alder={20}
                ident={personIdent}
                kjønn={kjønn}
                navn={
                    <div className={styles.visningsnavn}>
                        <Label size={'small'} as={'p'}>
                            {navn}
                        </Label>
                    </div>
                }
            >
                {folkeregisterpersonstatus && (
                    <div className={styles.elementContainer}>
                        <PersonStatusVarsel folkeregisterpersonstatus={folkeregisterpersonstatus} />
                    </div>
                )}
                {adressebeskyttelse && (
                    <div className={styles.elementContainer}>
                        <AdressebeskyttelseVarsel adressebeskyttelse={adressebeskyttelse} />
                    </div>
                )}
                {egenAnsatt && (
                    <div className={styles.elementContainer}>
                        <EtikettFokus>Egen ansatt</EtikettFokus>
                    </div>
                )}
                {fullmakt.some(
                    (f) => f.gyldigTilOgMed === null || erEtterDagensDato(f.gyldigTilOgMed)
                ) && (
                    <div className={styles.elementContainer}>
                        <EtikettFokus>Fullmakt</EtikettFokus>
                    </div>
                )}

                {vergemål.length > 0 && (
                    <div className={styles.elementContainer}>
                        <EtikettFokus>Verge</EtikettFokus>
                    </div>
                )}
            </FamilieVisittkort>
            <HStack justify="end" gap="4">
                {skalLenkeTilFagsystemBehandling && (
                    <Link href={behandlingLenke} target="_blank">
                        Gå til behandling
                        <ExternalLinkIcon aria-label="Gå til behandling" fontSize={'1.375rem'} />
                    </Link>
                )}
                {skalLenkeTilTilbakekreving && (
                    <Link href={tilbakekrevingLenke} target="_blank">
                        Gå til tilbakekreving
                        <ExternalLinkIcon
                            aria-label="Gå til tilbakekreving"
                            fontSize={'1.375rem'}
                        />
                    </Link>
                )}
                <Link href={saksoversiktLenke} target="_blank">
                    Gå til saksoversikt
                    <ExternalLinkIcon aria-label="Gå til saksoversikt" fontSize={'1.375rem'} />
                </Link>
                {behandling && (
                    <>
                        <HStack justify="end" gap="4">
                            <EtikettSuksess>
                                {stønadstypeTilTekst[behandling.stønadstype]}
                            </EtikettSuksess>
                            {behandling.årsak === Klagebehandlingsårsak.HENVENDELSE_FRA_KABAL && (
                                <EtikettInfo>
                                    {klagebehandlingsårsakTilTekst[behandling.årsak]}
                                </EtikettInfo>
                            )}
                        </HStack>
                        <SettPåVentKnapp />
                        <EndreBehandlendeEnhetKnapp fagsystem={behandling.fagsystem} />
                        <HenleggKnapp />
                    </>
                )}
            </HStack>
        </div>
    );
};
