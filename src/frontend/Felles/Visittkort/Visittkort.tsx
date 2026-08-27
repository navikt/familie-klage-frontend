import { Box, HGrid, HStack } from '@navikt/ds-react';
import React from 'react';
import { usePersonopplysningerContext } from '../../App/context/PersonopplysningerContext';
import type { Behandling } from '../../App/typer/fagsak';
import { formaterOrgNummer } from '../../App/typer/institusjon';
import { nullableDatoTilAlder } from '../../App/utils/dato';
import { formaterFødselsnummer } from '../../App/utils/formatter';
import { IkonVelger } from '../IkonVelger/IkonVelger';
import { LenkerOgKnapper } from './LenkerOgKnapper';
import { NavnOgIdent } from './NavnOgIdent';
import { PersonopplysningerVarsler } from './PersonopplysningerVarsler';

interface Props {
    behandling: Behandling;
}

export function Visittkort({ behandling }: Props) {
    const { fagsakEier, søker } = usePersonopplysningerContext();
    const skalViseSøker = fagsakEier.personIdent != søker.personIdent;

    return (
        <Box borderWidth={'0 0 1 0'} paddingInline={'space-16'} paddingBlock={'space-8'}>
            <HGrid columns={'auto 1fr'} align={'center'} gap={'space-16'}>
                <HStack align={'center'} gap={'space-8 space-12'}>
                    <HStack align={'center'} gap={'space-8 space-12'} wrap={false}>
                        <IkonVelger
                            kjønn={fagsakEier.kjønn}
                            alder={nullableDatoTilAlder(fagsakEier.fødselsdato)}
                            institusjon={behandling.institusjon}
                        />
                        <NavnOgIdent
                            navn={fagsakEier.navn}
                            ident={formaterFødselsnummer(fagsakEier.personIdent)}
                            alder={nullableDatoTilAlder(fagsakEier.fødselsdato)}
                        />
                    </HStack>
                    <PersonopplysningerVarsler personopplysninger={fagsakEier} />
                    {skalViseSøker && (
                        <>
                            <div>|</div>
                            <NavnOgIdent
                                navn={`Søker: ${søker.navn}`}
                                ident={formaterFødselsnummer(søker.personIdent)}
                                alder={nullableDatoTilAlder(søker.fødselsdato)}
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
            </HGrid>
        </Box>
    );
}
