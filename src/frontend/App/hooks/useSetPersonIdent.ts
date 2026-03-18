import { useApp } from '../context/AppContext';
import { useEffect } from 'react';
import { IPersonopplysningerFagsakeierOgSøker } from '../typer/personopplysninger';

export const useSetPersonIdent = (personopplysninger: IPersonopplysningerFagsakeierOgSøker) => {
    const { settFagsakEierPersonIdent, settSøkerPersonIdent } = useApp();

    useEffect(() => {
        settFagsakEierPersonIdent(personopplysninger.fagsakEier.personIdent);
        return () => settFagsakEierPersonIdent(undefined);
    }, [settFagsakEierPersonIdent, personopplysninger.fagsakEier.personIdent]);

    useEffect(() => {
        settSøkerPersonIdent(personopplysninger.søker.personIdent);
        return () => settSøkerPersonIdent(undefined);
    }, [settSøkerPersonIdent, personopplysninger.søker.personIdent]);

    return {};
};
