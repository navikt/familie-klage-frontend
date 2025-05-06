import * as React from 'react';
import styled from 'styled-components';
import { BodyLong, BodyShort, Heading } from '@navikt/ds-react';
import { IVurdering, VedtakValg, vedtakValgTilTekst, årsakValgTilTekst } from './vurderingValg';
import { alleHjemlerTilVisningstekst } from './hjemmel';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin: 2rem 4rem;
`;

const Avsnitt = styled.div`
    margin: 0 0 2rem 0;
`;

const FritekstfeltLesemodus = styled(BodyLong)`
    white-space: pre-wrap;
`;

export const VurderingLesemodus: React.FC<{ vurdering: IVurdering }> = ({ vurdering }) => {
    if (vurdering === null) {
        return <></>;
    }
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
                        Begrunnelse for omgjøring (internt notat)
                    </Heading>
                    <FritekstfeltLesemodus>{begrunnelseOmgjøring}</FritekstfeltLesemodus>
                </Avsnitt>
            )}
        </Container>
    );
};

const OpprettholdVedtak: React.FC<{ vurdering: IVurdering }> = ({ vurdering }) => {
    const {
        vedtak,
        hjemmel,
        innstillingKlageinstans,
        dokumentasjonOgUtredning,
        spørsmåletISaken,
        aktuelleRettskilder,
        klagersAnførsler,
        vurderingAvKlagen,
        interntNotat,
    } = vurdering;
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
                    <BodyShort>{alleHjemlerTilVisningstekst[hjemmel]}</BodyShort>
                </Avsnitt>
            )}
            {innstillingKlageinstans && (
                <Avsnitt>
                    <Heading level="1" size="medium">
                        Innstilling til NAV Klageinstans
                    </Heading>
                    <FritekstfeltLesemodus>{innstillingKlageinstans}</FritekstfeltLesemodus>
                </Avsnitt>
            )}
            {(dokumentasjonOgUtredning ||
                spørsmåletISaken ||
                aktuelleRettskilder ||
                klagersAnførsler ||
                vurderingAvKlagen) && (
                <Avsnitt>
                    <Heading level="1" size="medium">
                        Innstilling til Nav Klageinstans
                    </Heading>
                </Avsnitt>
            )}
            {dokumentasjonOgUtredning && (
                <Avsnitt>
                    <Heading level="2" size="small">
                        Dokumentasjon og utredning
                    </Heading>
                    <FritekstfeltLesemodus>{dokumentasjonOgUtredning}</FritekstfeltLesemodus>
                </Avsnitt>
            )}
            {spørsmåletISaken && (
                <Avsnitt>
                    <Heading level="2" size="small">
                        Spørsmålet i saken
                    </Heading>
                    <FritekstfeltLesemodus>{spørsmåletISaken}</FritekstfeltLesemodus>
                </Avsnitt>
            )}
            {aktuelleRettskilder && (
                <Avsnitt>
                    <Heading level="2" size="small">
                        Aktuelle rettskilder
                    </Heading>
                    <FritekstfeltLesemodus>{aktuelleRettskilder}</FritekstfeltLesemodus>
                </Avsnitt>
            )}
            {klagersAnførsler && (
                <Avsnitt>
                    <Heading level="2" size="small">
                        Klagers anførsler
                    </Heading>
                    <FritekstfeltLesemodus>{klagersAnførsler}</FritekstfeltLesemodus>
                </Avsnitt>
            )}
            {vurderingAvKlagen && (
                <Avsnitt>
                    <Heading level="2" size="small">
                        Vurdering av klagen
                    </Heading>
                    <FritekstfeltLesemodus>{vurderingAvKlagen}</FritekstfeltLesemodus>
                </Avsnitt>
            )}
            {interntNotat && (
                <Avsnitt>
                    <Heading level="1" size="medium">
                        Internt notat
                    </Heading>
                    <FritekstfeltLesemodus>{interntNotat}</FritekstfeltLesemodus>
                </Avsnitt>
            )}
        </Container>
    );
};
