import React from 'react';
import styles from './Visittkort.module.css';
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
        </>
    );
};
