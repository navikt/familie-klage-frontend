import React from 'react';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import { PersonStatusVarsel } from '../Varsel/PersonStatusVarsel';
import { AdressebeskyttelseVarsel } from '../Varsel/AdressebeskyttelseVarsel';
import { EtikettFokus } from '../Varsel/Etikett';
import { erEtterDagensDato } from '../../App/utils/dato';
import { HStack } from '@navikt/ds-react';

export const PersonopplysningerVarsler = ({
    personopplysninger: {
        folkeregisterpersonstatus,
        adressebeskyttelse,
        egenAnsatt,
        fullmakt,
        vergemål,
    },
}: {
    personopplysninger: IPersonopplysninger;
}) => {
    const folkregisterpersonstatusVarsel = folkeregisterpersonstatus && (
        <PersonStatusVarsel folkeregisterpersonstatus={folkeregisterpersonstatus} />
    );

    const adressebeskyttelseVarsel = adressebeskyttelse && (
        <AdressebeskyttelseVarsel adressebeskyttelse={adressebeskyttelse} />
    );

    const egenAnsattVarsel = egenAnsatt && <EtikettFokus>Egen ansatt</EtikettFokus>;

    const fullmaktVarsel = fullmakt.some(
        (f) => f.gyldigTilOgMed === null || erEtterDagensDato(f.gyldigTilOgMed)
    ) && <EtikettFokus>Fullmakt</EtikettFokus>;

    const vergemålVarsel = vergemål.length > 0 && <EtikettFokus>Verge</EtikettFokus>;

    if (
        !folkregisterpersonstatusVarsel &&
        !adressebeskyttelseVarsel &&
        !egenAnsattVarsel &&
        !fullmaktVarsel &&
        !vergemålVarsel
    ) {
        return null;
    }

    return (
        <>
            <div>|</div>
            <HStack align={'center'} gap={'space-8 space-12'} wrap={false}>
                {folkregisterpersonstatusVarsel}
                {adressebeskyttelseVarsel}
                {egenAnsattVarsel}
                {fullmaktVarsel}
                {vergemålVarsel}
            </HStack>
        </>
    );
};
