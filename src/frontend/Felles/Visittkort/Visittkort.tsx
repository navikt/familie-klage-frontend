import React from 'react';
import styles from './Visittkort.module.css';
import { Behandling } from '../../App/typer/fagsak';
import { BodyShort, CopyButton, HStack, Label } from '@navikt/ds-react';
import { IkonVelger } from '../IkonVelger/IkonVelger';
import { formaterOrgNummer, Institusjon } from '../../App/typer/institusjon';
import { usePersonopplysningerContext } from '../../App/context/PersonopplysningerContext';
import { LenkerOgKnapper } from './LenkerOgKnapper';
import { PersonopplysningerVarsler } from './PersonopplysningerVarsler';

interface Props {
    behandling: Behandling;
}

export function Visittkort({ behandling }: Props) {
    const { fagsakEier } = usePersonopplysningerContext();

    return (
        <div className={styles.container}>
            <HStack justify={'space-between'} width={'100%'}>
                <VisittkortInner
                    alder={20}
                    ident={fagsakEier.personIdent}
                    kjønn={fagsakEier.kjønn}
                    navn={
                        <div className={styles.visningsnavn}>
                            <Label size={'small'} as={'p'}>
                                {fagsakEier.navn}
                            </Label>
                        </div>
                    }
                    institusjon={behandling.institusjon}
                >
                    <PersonopplysningerVarsler personopplysninger={fagsakEier} />
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
