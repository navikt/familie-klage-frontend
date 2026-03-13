import React from 'react';
import styles from './Visittkort.module.css';
import { Behandling } from '../../App/typer/fagsak';
import { HStack } from '@navikt/ds-react';
import { IkonVelger } from '../IkonVelger/IkonVelger';
import { formaterOrgNummer, Institusjon } from '../../App/typer/institusjon';
import { usePersonopplysningerContext } from '../../App/context/PersonopplysningerContext';
import { LenkerOgKnapper } from './LenkerOgKnapper';
import { PersonopplysningerVarsler } from './PersonopplysningerVarsler';
import { NavnOgIdent } from './NavnOgIdent';
import { formaterFødselsnummer } from '../../App/utils/formatter';

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
                    navn={fagsakEier.navn}
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
    navn: string;
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
        <NavnOgIdent navn={navn} ident={formaterFødselsnummer(ident)} alder={alder} />
        {institusjon && (
            <>
                <div>|</div>
                <NavnOgIdent
                    navn={`Søker: ${institusjon.navn}`}
                    ident={formaterOrgNummer(institusjon.orgNummer)}
                />
            </>
        )}
        {children}
    </HStack>
);
