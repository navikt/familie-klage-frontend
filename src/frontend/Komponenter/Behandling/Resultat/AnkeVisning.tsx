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

export const AnkeVisning: React.FC<Props> = ({ behandling }) => {
    const ankeResultater = behandling.klageinstansResultat.filter((resultat) =>
        [
            KlageinstansEventType.ANKE_I_TRYGDERETTENBEHANDLING_OPPRETTET,
            KlageinstansEventType.ANKEBEHANDLING_OPPRETTET,
            KlageinstansEventType.ANKEBEHANDLING_AVSLUTTET,
        ].includes(resultat.type)
    );

    return ankeResultater.length > 0 ? (
        <Alert variant={'warning'}>
            <Heading spacing size="small" level="3">
                Merk at det finnes informasjon om anke på denne klagen
            </Heading>
            {ankeResultater.map((resultat) => (
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
