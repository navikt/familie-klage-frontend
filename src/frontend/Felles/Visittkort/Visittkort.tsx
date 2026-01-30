import React from 'react';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import styles from './Visittkort.module.css';
import {
    Behandling,
    Klagebehandlingsårsak,
    klagebehandlingsårsakTilTekst,
    PåklagetVedtakstype,
} from '../../App/typer/fagsak';
import { HenleggKnapp } from './HenleggKnapp';
import { BodyShort, CopyButton, HStack, Label, Link, Stack } from '@navikt/ds-react';
import { PersonStatusVarsel } from '../Varsel/PersonStatusVarsel';
import { AdressebeskyttelseVarsel } from '../Varsel/AdressebeskyttelseVarsel';
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
import { IkonVelger } from '../IkonVelger/IkonVelger';
import { formaterOrgNummer, Institusjon } from '../../App/typer/institusjon';

interface Props {
    personopplysninger: IPersonopplysninger;
    behandling: Behandling;
}

export function Visittkort({ personopplysninger, behandling }: Props) {
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
            <HStack justify={'space-between'} width={'100%'}>
                <VisittkortInner
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
                    institusjon={behandling.institusjon}
                >
                    {folkeregisterpersonstatus && (
                        <div className={styles.elementContainer}>
                            <PersonStatusVarsel
                                folkeregisterpersonstatus={folkeregisterpersonstatus}
                            />
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
                </VisittkortInner>
                <HStack align={'center'} justify={'start'} gap={'space-8'} padding={'space-8'}>
                    {skalLenkeTilFagsystemBehandling && (
                        <Link href={behandlingLenke} target="_blank">
                            Gå til behandling
                            <ExternalLinkIcon
                                aria-label="Gå til behandling"
                                fontSize={'1.375rem'}
                            />
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
                        <Stack direction={'row'} gap={'space-8'}>
                            <HStack justify={'end'} gap={'space-8'}>
                                <EtikettSuksess>
                                    {stønadstypeTilTekst[behandling.stønadstype]}
                                </EtikettSuksess>
                                {behandling.årsak ===
                                    Klagebehandlingsårsak.HENVENDELSE_FRA_KABAL && (
                                    <EtikettInfo>
                                        {klagebehandlingsårsakTilTekst[behandling.årsak]}
                                    </EtikettInfo>
                                )}
                            </HStack>
                            <SettPåVentKnapp />
                            <EndreBehandlendeEnhetKnapp fagsystem={behandling.fagsystem} />
                            <HenleggKnapp />
                        </Stack>
                    )}
                </HStack>
            </HStack>
        </div>
    );
}

export interface IProps extends React.PropsWithChildren {
    alder: number;
    ident: string;
    kjønn: Kjønn;
    navn: string | React.ReactNode;
    institusjon?: Institusjon;
}

enum Kjønn {
    KVINNE = 'KVINNE',
    MANN = 'MANN',
    UKJENT = 'UKJENT',
}

const VisittkortInner: React.FunctionComponent<IProps> = ({
    alder,
    children,
    ident,
    kjønn,
    navn,
    institusjon,
}) => (
    <HStack align={'center'} gap={'space-8'} padding={'space-8'}>
        <IkonVelger alder={alder} kjønn={kjønn} width={24} height={24} institusjon={institusjon} />
        {typeof navn === 'string' ? (
            <Label size={'small'}>
                {navn} ({alder} år)
            </Label>
        ) : (
            navn
        )}
        <div>|</div>
        <HStack align={'center'} gap={'space-8'} wrap={false}>
            {ident}
            <CopyButton copyText={ident.replace(' ', '')} size={'small'} />
        </HStack>
        {institusjon && (
            <HStack align={'center'} gap={'space-8'} wrap={false}>
                <div>|</div>
                <HStack align={'center'} gap={'1'} wrap={false}>
                    <BodyShort weight={'semibold'}>Søker:</BodyShort>
                    {institusjon.navn}
                </HStack>
                <div>|</div>
                <HStack align={'center'} gap={'1'} wrap={false}>
                    <BodyShort>{formaterOrgNummer(institusjon.orgNummer)} </BodyShort>
                    <CopyButton copyText={institusjon.orgNummer.replace(' ', '')} size={'small'} />
                </HStack>
            </HStack>
        )}
        {children}
    </HStack>
);
