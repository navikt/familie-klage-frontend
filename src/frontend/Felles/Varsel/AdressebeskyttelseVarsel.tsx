import React from 'react';
import { Adressebeskyttelse } from '../../App/typer/personopplysninger';
import { EtikettAdvarsel } from './Etikett';

interface Props {
    adressebeskyttelse: Adressebeskyttelse;
}

export const AdressebeskyttelseVarsel: React.FC<Props> = ({ adressebeskyttelse }) => {
    switch (adressebeskyttelse) {
        case Adressebeskyttelse.STRENGT_FORTROLIG_UTLAND:
            return <EtikettAdvarsel>Kode 6 U</EtikettAdvarsel>;
        case Adressebeskyttelse.STRENGT_FORTROLIG:
            return <EtikettAdvarsel>Kode 6</EtikettAdvarsel>;
        case Adressebeskyttelse.FORTROLIG:
            return <EtikettAdvarsel>Kode 7</EtikettAdvarsel>;
        default:
            return null;
    }
};
