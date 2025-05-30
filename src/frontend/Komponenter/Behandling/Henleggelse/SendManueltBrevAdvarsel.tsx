import { Alert } from '@navikt/ds-react';
import React from 'react';
import {
    erPersonopplysningerTilknyttetFullmakt,
    harPersonopplysningerVergemål,
    IPersonopplysninger,
} from '../../../App/typer/personopplysninger';

interface Props {
    personopplysninger: IPersonopplysninger;
}

export function SendManueltBrevAdvarsel({ personopplysninger }: Props) {
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
