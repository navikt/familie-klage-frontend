import React from 'react';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import { PersonStatusVarsel } from '../Varsel/PersonStatusVarsel';
import { AdressebeskyttelseVarsel } from '../Varsel/AdressebeskyttelseVarsel';
import { EtikettFokus } from '../Varsel/Etikett';
import { erEtterDagensDato } from '../../App/utils/dato';

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
    return (
        <>
            {folkeregisterpersonstatus && (
                <PersonStatusVarsel folkeregisterpersonstatus={folkeregisterpersonstatus} />
            )}
            {adressebeskyttelse && (
                <AdressebeskyttelseVarsel adressebeskyttelse={adressebeskyttelse} />
            )}
            {egenAnsatt && <EtikettFokus>Egen ansatt</EtikettFokus>}
            {fullmakt.some(
                (f) => f.gyldigTilOgMed === null || erEtterDagensDato(f.gyldigTilOgMed)
            ) && <EtikettFokus>Fullmakt</EtikettFokus>}
            {vergemål.length > 0 && <EtikettFokus>Verge</EtikettFokus>}
        </>
    );
};
