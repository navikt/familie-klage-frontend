import * as React from 'react';
import { Behandling, Fagsystem } from '../../../../App/typer/fagsak';
import { LesMerOmInnstilling } from '../InnstillingTilNavKlageinstans/LesMerOmInnstilling';
import { Accordion, Box, Heading } from '@navikt/ds-react';
import { InnstillingTilNavKlageinstansAvsnitt } from './InnstillingTilNavKlageinstansAvsnitt';
import { Tekstfelt } from './Tekstfelt';

export interface AccordionTilstand {
    dokumentasjonOgUtredning: boolean;
    spørsmåletISaken: boolean;
    aktuelleRettskilder: boolean;
    klagersAnførsler: boolean;
    vurderingAvKlagen: boolean;
}

interface Props {
    behandling: Behandling;
    accordionTilstand: AccordionTilstand;
    toggleAccordionTilstand: (feltnavn: keyof AccordionTilstand) => void;
}

export const InnstillingTilNavKlageinstans = ({
    behandling,
    accordionTilstand,
    toggleAccordionTilstand,
}: Props) => {
    return (
        <Box maxWidth="40rem">
            <Heading spacing size="medium" level="2">
                Innstilling til Nav Klageinstans (kommer med i brev til bruker)
            </Heading>
            {behandling.fagsystem === Fagsystem.EF ? (
                <>
                    <Tekstfelt
                        visningsnavn="Innstilling til Nav Klageinstans (kommer med i brev til bruker)"
                        feltnavn={'innstillingKlageinstans'}
                    />
                    <LesMerOmInnstilling />
                </>
            ) : (
                <>
                    <Accordion size="small" headingSize="xsmall">
                        <InnstillingTilNavKlageinstansAvsnitt
                            visningsnavn="Dokumentasjon og utredning"
                            feltnavn="dokumentasjonOgUtredning"
                            åpen={accordionTilstand.dokumentasjonOgUtredning}
                            toggleÅpen={toggleAccordionTilstand}
                        />
                        <InnstillingTilNavKlageinstansAvsnitt
                            visningsnavn="Spørsmålet i saken"
                            feltnavn="spørsmåletISaken"
                            åpen={accordionTilstand.spørsmåletISaken}
                            toggleÅpen={toggleAccordionTilstand}
                        />
                        <InnstillingTilNavKlageinstansAvsnitt
                            visningsnavn="Aktuelle rettskilder"
                            feltnavn="aktuelleRettskilder"
                            åpen={accordionTilstand.aktuelleRettskilder}
                            toggleÅpen={toggleAccordionTilstand}
                        />
                        <InnstillingTilNavKlageinstansAvsnitt
                            visningsnavn="Klagers anførsler"
                            feltnavn="klagersAnførsler"
                            åpen={accordionTilstand.klagersAnførsler}
                            toggleÅpen={toggleAccordionTilstand}
                        />
                        <InnstillingTilNavKlageinstansAvsnitt
                            visningsnavn="Vurdering av klagen"
                            feltnavn="vurderingAvKlagen"
                            åpen={accordionTilstand.vurderingAvKlagen}
                            toggleÅpen={toggleAccordionTilstand}
                        />
                    </Accordion>
                </>
            )}
        </Box>
    );
};
