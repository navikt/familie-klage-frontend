import * as React from 'react';
import { BodyLong, BodyShort, Heading, VStack } from '@navikt/ds-react';
import { IVurdering, VedtakValg, vedtakValgTilTekst, årsakValgTilTekst } from './vurderingValg';
import { alleHjemlerTilVisningstekst } from './hjemmel';

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
        <VStack gap="8" margin="8">
            {vedtak && (
                <div>
                    <Heading level="2" size="medium">
                        Vedtak
                    </Heading>
                    <BodyShort>{vedtakValgTilTekst[vedtak]}</BodyShort>
                </div>
            )}
            {årsak && (
                <div>
                    <Heading level="2" size="medium">
                        Årsak
                    </Heading>
                    <BodyShort>{årsakValgTilTekst[årsak]}</BodyShort>
                </div>
            )}
            {begrunnelseOmgjøring && (
                <div>
                    <Heading level="2" size="medium">
                        Begrunnelse for omgjøring (internt notat)
                    </Heading>
                    <BodyLong>{begrunnelseOmgjøring}</BodyLong>
                </div>
            )}
        </VStack>
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
        <VStack gap="8" margin="8">
            {vedtak && (
                <div>
                    <Heading level="2" size="medium">
                        Vedtak
                    </Heading>
                    <BodyShort>{vedtakValgTilTekst[vedtak]}</BodyShort>
                </div>
            )}
            {hjemmel && (
                <div>
                    <Heading level="2" size="medium">
                        Årsak
                    </Heading>
                    <BodyShort>{alleHjemlerTilVisningstekst[hjemmel]}</BodyShort>
                </div>
            )}
            {innstillingKlageinstans && (
                <div>
                    <Heading level="2" size="medium">
                        Innstilling til Nav Klageinstans
                    </Heading>
                    <BodyLong>{innstillingKlageinstans}</BodyLong>
                </div>
            )}
            {(dokumentasjonOgUtredning ||
                spørsmåletISaken ||
                aktuelleRettskilder ||
                klagersAnførsler ||
                vurderingAvKlagen) && (
                <div>
                    <Heading level="2" size="medium">
                        Innstilling til Nav Klageinstans
                    </Heading>
                </div>
            )}
            {dokumentasjonOgUtredning && (
                <div>
                    <Heading level="2" size="small">
                        Dokumentasjon og utredning
                    </Heading>
                    <BodyLong>{dokumentasjonOgUtredning}</BodyLong>
                </div>
            )}
            {spørsmåletISaken && (
                <div>
                    <Heading level="2" size="small">
                        Spørsmålet i saken
                    </Heading>
                    <BodyLong>{spørsmåletISaken}</BodyLong>
                </div>
            )}
            {aktuelleRettskilder && (
                <div>
                    <Heading level="2" size="small">
                        Aktuelle rettskilder
                    </Heading>
                    <BodyLong>{aktuelleRettskilder}</BodyLong>
                </div>
            )}
            {klagersAnførsler && (
                <div>
                    <Heading level="2" size="small">
                        Klagers anførsler
                    </Heading>
                    <BodyLong>{klagersAnførsler}</BodyLong>
                </div>
            )}
            {vurderingAvKlagen && (
                <div>
                    <Heading level="2" size="small">
                        Vurdering av klagen
                    </Heading>
                    <BodyLong>{vurderingAvKlagen}</BodyLong>
                </div>
            )}
            {interntNotat && (
                <div>
                    <Heading level="2" size="medium">
                        Internt notat
                    </Heading>
                    <BodyLong>{interntNotat}</BodyLong>
                </div>
            )}
        </VStack>
    );
};
