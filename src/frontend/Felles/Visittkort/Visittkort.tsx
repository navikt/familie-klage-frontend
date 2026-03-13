import React from 'react';
import styles from './Visittkort.module.css';
import { Behandling } from '../../App/typer/fagsak';
import { HStack } from '@navikt/ds-react';
import { IkonVelger } from '../IkonVelger/IkonVelger';
import { formaterOrgNummer } from '../../App/typer/institusjon';
import { usePersonopplysningerContext } from '../../App/context/PersonopplysningerContext';
import { LenkerOgKnapper } from './LenkerOgKnapper';
import { PersonopplysningerVarsler } from './PersonopplysningerVarsler';
import { NavnOgIdent } from './NavnOgIdent';
import { formaterFødselsnummer } from '../../App/utils/formatter';

interface Props {
    behandling: Behandling;
}

export function Visittkort({ behandling }: Props) {
    const { fagsakEier, søker } = usePersonopplysningerContext();
    const skalViseSøker = fagsakEier.personIdent != søker.personIdent;

    return (
        <div className={styles.container}>
            <HStack justify={'space-between'} width={'100%'}>
                <HStack align={'center'} gap={'space-8'} padding={'space-8'}>
                    <IkonVelger
                        alder={20}
                        kjønn={fagsakEier.kjønn}
                        width={24}
                        height={24}
                        institusjon={behandling.institusjon}
                    />
                    <NavnOgIdent
                        navn={fagsakEier.navn}
                        ident={formaterFødselsnummer(fagsakEier.personIdent)}
                    />
                    <PersonopplysningerVarsler personopplysninger={fagsakEier} />
                    {skalViseSøker && (
                        <>
                            <div>|</div>
                            <NavnOgIdent
                                navn={`Søker: ${søker.navn}`}
                                ident={formaterFødselsnummer(søker.personIdent)}
                            />
                        </>
                    )}
                    {behandling.institusjon && (
                        <>
                            <div>|</div>
                            <NavnOgIdent
                                navn={`Søker: ${behandling.institusjon.navn}`}
                                ident={formaterOrgNummer(behandling.institusjon.orgNummer)}
                            />
                        </>
                    )}
                </HStack>
                <LenkerOgKnapper behandling={behandling} />
            </HStack>
        </div>
    );
}
