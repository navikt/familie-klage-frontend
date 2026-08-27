import { Alert, BodyShort, Heading, Label } from '@navikt/ds-react';
import * as React from 'react';
import type { Behandling } from '../../../App/typer/fagsak';
import { KlageinstansEventType } from '../../../App/typer/fagsak';
import { formaterIsoDatoTid } from '../../../App/utils/formatter';

export const FeilregistrertVisning: React.FC<{ behandling: Behandling }> = ({ behandling }) => {
    const feilregistrertResultat = behandling.klageinstansResultat.find(
        resultat => resultat.type === KlageinstansEventType.BEHANDLING_FEILREGISTRERT
    );

    return feilregistrertResultat ? (
        <Alert variant={'warning'}>
            <Heading spacing size="small" level="3">
                Behandling feilregistrert av NAV klageinstans
            </Heading>
            <Label size={'small'}>
                {formaterIsoDatoTid(feilregistrertResultat.mottattEllerAvsluttetTidspunkt)}
            </Label>
            <BodyShort>{feilregistrertResultat.årsakFeilregistrert}</BodyShort>
        </Alert>
    ) : null;
};
