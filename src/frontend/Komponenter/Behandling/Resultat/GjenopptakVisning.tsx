import * as React from 'react';
import {
    Behandling,
    klagehendelseTypeTilTekst,
    KlageinstansEventType,
    utfallTilTekst,
} from '../../../App/typer/fagsak';
import { Alert, BodyShort, Heading, Label } from '@navikt/ds-react';
import { formaterIsoDatoTid } from '../../../App/utils/formatter';

interface Props {
    behandling: Behandling;
}

export const GjenopptakVisning: React.FC<Props> = ({ behandling }) => {
    const gjenopptakResultat = behandling.klageinstansResultat.filter((resultat) =>
        [KlageinstansEventType.GJENOPPTAKSBEHANDLING_AVSLUTTET].includes(resultat.type)
    );

    return gjenopptakResultat.length > 0 ? (
        <Alert variant={'warning'}>
            <Heading spacing size="small" level="3">
                Merk at det finnes informasjon om gjenopptak på denne klagen
            </Heading>
            {gjenopptakResultat.map((resultat) => (
                <div key={resultat.mottattEllerAvsluttetTidspunkt}>
                    <Label size={'small'}>
                        {formaterIsoDatoTid(resultat.mottattEllerAvsluttetTidspunkt)}
                    </Label>
                    <BodyShort size={'small'}>{klagehendelseTypeTilTekst[resultat.type]}</BodyShort>
                    {resultat.utfall && (
                        <BodyShort size={'small'}>{utfallTilTekst[resultat.utfall]}</BodyShort>
                    )}
                </div>
            ))}
        </Alert>
    ) : null;
};
