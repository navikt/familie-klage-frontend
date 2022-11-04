import * as React from 'react';
import styled from 'styled-components';
import { BodyLong, BodyShort, Heading } from '@navikt/ds-react';
import {
    hjemmelTilTekst,
    IVurdering,
    VedtakValg,
    vedtakValgTilTekst,
    årsakValgTilTekst,
} from './vurderingValg';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 4rem;
`;

const Avsnitt = styled.div`
    margin: 0 0 2rem 0;
`;

export const VurderingLesemodus: React.FC<{ vurdering: IVurdering }> = ({ vurdering }) => {
    switch (vurdering.vedtak) {
        case VedtakValg.OMGJØR_VEDTAK:
            return <OmgjørVedtak vurdering={vurdering} />;
        case VedtakValg.OPPRETTHOLD_VEDTAK:
            return <OpprettholdVedtak vurdering={vurdering} />;
        default:
            return <></>;
    }
};

const OmgjørVedtak: React.FC<{ vurdering: IVurdering }> = ({ vurdering }) => {
    const { vedtak, årsak, begrunnelseOmgjøring } = vurdering;
    return (
        <Container>
            {vedtak && (
                <Avsnitt>
                    <Heading level="1" size="medium">
                        Vedtak
                    </Heading>
                    <BodyShort>{vedtakValgTilTekst[vedtak]}</BodyShort>
                </Avsnitt>
            )}
            {årsak && (
                <Avsnitt>
                    <Heading level="1" size="medium">
                        Årsak
                    </Heading>
                    <BodyShort>{årsakValgTilTekst[årsak]}</BodyShort>
                </Avsnitt>
            )}
            {begrunnelseOmgjøring && (
                <Avsnitt>
                    <Heading level="1" size="medium">
                        Begrunnelse for omgjøring
                    </Heading>
                    <BodyLong>{begrunnelseOmgjøring}</BodyLong>
                </Avsnitt>
            )}
        </Container>
    );
};

const OpprettholdVedtak: React.FC<{ vurdering: IVurdering }> = ({ vurdering }) => {
    const { vedtak, hjemmel, innstillingKlageinstans, interntNotat } = vurdering;
    return (
        <Container>
            {vedtak && (
                <Avsnitt>
                    <Heading level="1" size="medium">
                        Vedtak
                    </Heading>
                    <BodyShort>{vedtakValgTilTekst[vedtak]}</BodyShort>
                </Avsnitt>
            )}
            {hjemmel && (
                <Avsnitt>
                    <Heading level="1" size="medium">
                        Årsak
                    </Heading>
                    <BodyShort>{hjemmelTilTekst[hjemmel]}</BodyShort>
                </Avsnitt>
            )}
            {innstillingKlageinstans && (
                <Avsnitt>
                    <Heading level="1" size="medium">
                        Innstilling til NAV Klageinstans
                    </Heading>
                    <BodyLong>{innstillingKlageinstans}</BodyLong>
                </Avsnitt>
            )}
            {interntNotat && (
                <Avsnitt>
                    <Heading level="1" size="medium">
                        Internt notat
                    </Heading>
                    <BodyLong>{interntNotat}</BodyLong>
                </Avsnitt>
            )}
        </Container>
    );
};
