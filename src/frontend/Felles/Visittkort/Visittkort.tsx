import React from 'react';
import { Behandling } from '../../App/typer/fagsak';
import { Box, HGrid, HStack } from '@navikt/ds-react';
import { IkonVelger } from '../IkonVelger/IkonVelger';
import { formaterOrgNummer } from '../../App/typer/institusjon';
import { usePersonopplysningerContext } from '../../App/context/PersonopplysningerContext';
import { LenkerOgKnapper } from './LenkerOgKnapper';
import { PersonopplysningerVarsler } from './PersonopplysningerVarsler';
import { NavnOgIdent } from './NavnOgIdent';
import { formaterFødselsnummer } from '../../App/utils/formatter';
import { nullableDatoTilAlder } from '../../App/utils/dato';

interface Props {
    behandling: Behandling;
}

export function Visittkort({ behandling }: Props) {
    const { fagsakEier, søker } = usePersonopplysningerContext();
    const skalViseSøker = fagsakEier.personIdent != søker.personIdent;

    return (
        <Box borderWidth={'0 0 1 0'} paddingInline={'4'} paddingBlock={'2'}>
            <HGrid columns={'auto 1fr'} align={'center'} gap={'4'}>
                <HStack align={'center'} gap={'space-8 space-12'}>
                    <HStack align={'center'} gap={'space-8 space-12'} wrap={false}>
                        <IkonVelger
                            alder={nullableDatoTilAlder(fagsakEier.fødselsdato) || 18}
                            kjønn={fagsakEier.kjønn}
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
