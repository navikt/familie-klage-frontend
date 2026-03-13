import React from 'react';
import styles from './Visittkort.module.css';
import { Behandling } from '../../App/typer/fagsak';
import { BodyShort, CopyButton, HStack, Label } from '@navikt/ds-react';
import { PersonStatusVarsel } from '../Varsel/PersonStatusVarsel';
import { AdressebeskyttelseVarsel } from '../Varsel/AdressebeskyttelseVarsel';
import { EtikettFokus } from '../Varsel/Etikett';
import { erEtterDagensDato } from '../../App/utils/dato';
import { IkonVelger } from '../IkonVelger/IkonVelger';
import { formaterOrgNummer, Institusjon } from '../../App/typer/institusjon';
import { usePersonopplysningerContext } from '../../App/context/PersonopplysningerContext';
import { LenkerOgKnapper } from './LenkerOgKnapper';

interface Props {
    behandling: Behandling;
}

export function Visittkort({ behandling }: Props) {
    const {
        fagsakEier: {
            personIdent,
            kjønn,
            navn,
            folkeregisterpersonstatus,
            adressebeskyttelse,
            egenAnsatt,
            fullmakt,
            vergemål,
        },
    } = usePersonopplysningerContext();

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
                <LenkerOgKnapper behandling={behandling} />
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
