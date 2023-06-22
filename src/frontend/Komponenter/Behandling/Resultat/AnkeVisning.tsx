import * as React from 'react';
import {
    Behandling,
    klagehendelseTypeTilTekst,
    KlageinstansEventType,
    utfallTilTekst,
} from '../../../App/typer/fagsak';
import { BodyShort, Label } from '@navikt/ds-react';
import styled from 'styled-components';
import { formaterIsoDatoTid } from '../../../App/utils/formatter';

const StyledAnkeInfo = styled.div`
    display: grid;
    grid-template-columns: 12rem 8.5rem 10rem;
    align-items: center;
`;

const Container = styled.div`
    margin: 2rem 1rem 1rem 1rem;
`;

export const AnkeVisning: React.FC<{ behandling: Behandling }> = ({ behandling }) => {
    const ankeResultater = behandling.klageinstansResultat.filter((resultat) =>
        [
            KlageinstansEventType.ANKE_I_TRYGDERETTENBEHANDLING_OPPRETTET,
            KlageinstansEventType.ANKEBEHANDLING_OPPRETTET,
            KlageinstansEventType.ANKEBEHANDLING_AVSLUTTET,
        ].includes(resultat.type)
    );

    return (
        <Container>
            {ankeResultater.map((resultat) => (
                <StyledAnkeInfo key={resultat.mottattEllerAvsluttetTidspunkt}>
                    <div>
                        <Label size={'small'}>{klagehendelseTypeTilTekst[resultat.type]}</Label>:
                    </div>
                    <BodyShort size={'small'}>
                        {formaterIsoDatoTid(resultat.mottattEllerAvsluttetTidspunkt)}
                    </BodyShort>
                    <BodyShort size={'small'}>
                        {resultat.utfall && utfallTilTekst[resultat.utfall]}
                    </BodyShort>
                </StyledAnkeInfo>
            ))}
        </Container>
    );
};
