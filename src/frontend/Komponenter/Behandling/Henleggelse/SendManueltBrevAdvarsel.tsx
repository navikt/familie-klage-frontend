import { Alert } from '@navikt/ds-react';
import React from 'react';
import {
    erPersonopplysningerTilknyttetFullmakt,
    harPersonopplysningerVergemål,
} from '../../../App/typer/personopplysninger';
import { usePersonopplysningerContext } from '../../../App/context/PersonopplysningerContext';

export function SendManueltBrevAdvarsel() {
    const personopplysninger = usePersonopplysningerContext();
    const erTilknyttetFullmakt = erPersonopplysningerTilknyttetFullmakt(personopplysninger);
    const harVergemål = harPersonopplysningerVergemål(personopplysninger);

    return (
        <>
            {harVergemål && (
                <Alert variant={'warning'}>
                    Verge registrert på bruker. Brev om trukket klage må sendes manuelt.
                </Alert>
            )}
            {erTilknyttetFullmakt && (
                <Alert variant={'warning'}>
                    Fullmakt registrert på bruker. Brev om trukket klage må sendes manuelt.
                </Alert>
            )}
        </>
    );
}
