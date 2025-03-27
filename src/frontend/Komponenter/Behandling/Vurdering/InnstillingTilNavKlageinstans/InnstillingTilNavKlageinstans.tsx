import { EnsligTextArea } from '../../../../Felles/Input/EnsligTextArea';
import * as React from 'react';
import { IVurdering } from '../vurderingValg';
import { Behandling, Fagsystem } from '../../../../App/typer/fagsak';
import styled from 'styled-components';
import { LesMerOmInnstilling } from './LesMerOmInnstilling';
import { Accordion, Heading } from '@navikt/ds-react';
import { InnstillingTilNavKlageinstansAvsnitt } from './InnstillingTilNavKlageinstansAvsnitt';

interface Props {
    behandling: Behandling;
    oppdatertVurdering: IVurdering;
    settIkkePersistertKomponent: (verdi: string) => void;
    settOppdatertVurdering: (vurdering: React.SetStateAction<IVurdering>) => void;
    settVurderingEndret: (endret: boolean) => void;
}

const FritekstFeltWrapper = styled.div`
    margin: 2rem 4rem 2rem 4rem;
`;

const StyledAccordion = styled(Accordion)`
    margin: 2rem 4rem 2rem 4rem;
    max-width: 40rem;
`;

export const InnstillingTilNavKlageinstans = ({
    behandling,
    oppdatertVurdering,
    settIkkePersistertKomponent,
    settOppdatertVurdering,
    settVurderingEndret,
}: Props) => {
    return behandling.fagsystem === Fagsystem.EF ? (
        <FritekstFeltWrapper>
            <EnsligTextArea
                label="Innstilling til Nav Klageinstans (kommer med i brev til bruker)"
                value={oppdatertVurdering.innstillingKlageinstans}
                onChange={(e) => {
                    settIkkePersistertKomponent(e.target.value);
                    settOppdatertVurdering((tidligereTilstand) => ({
                        ...tidligereTilstand,
                        innstillingKlageinstans: e.target.value,
                    }));
                    settVurderingEndret(true);
                }}
                size="medium"
                readOnly={false}
            />
            <LesMerOmInnstilling />
        </FritekstFeltWrapper>
    ) : (
        <StyledAccordion size="small" headingSize="xsmall">
            <Heading spacing size="medium" level="3">
                Innstilling til Nav Klageinstans (kommer med i brev til bruker)
            </Heading>
            <InnstillingTilNavKlageinstansAvsnitt
                tittel="Dokumentasjon og utredning"
                verdi={oppdatertVurdering.dokumentasjonOgUtredning}
                felt="dokumentasjonOgUtredning"
                settIkkePersistertKomponent={settIkkePersistertKomponent}
                settOppdatertVurdering={settOppdatertVurdering}
                settVurderingEndret={settVurderingEndret}
            />
            <InnstillingTilNavKlageinstansAvsnitt
                tittel="Spørsmålet i saken"
                verdi={oppdatertVurdering.spørsmåletISaken}
                felt="spørsmåletISaken"
                settIkkePersistertKomponent={settIkkePersistertKomponent}
                settOppdatertVurdering={settOppdatertVurdering}
                settVurderingEndret={settVurderingEndret}
            />
            <InnstillingTilNavKlageinstansAvsnitt
                tittel="Aktuelle rettskilder"
                verdi={oppdatertVurdering.aktuelleRettskilder}
                felt="aktuelleRettskilder"
                settIkkePersistertKomponent={settIkkePersistertKomponent}
                settOppdatertVurdering={settOppdatertVurdering}
                settVurderingEndret={settVurderingEndret}
            />
            <InnstillingTilNavKlageinstansAvsnitt
                tittel="Klagers anførsler"
                verdi={oppdatertVurdering.klagersAnførsler}
                felt="klagersAnførsler"
                settIkkePersistertKomponent={settIkkePersistertKomponent}
                settOppdatertVurdering={settOppdatertVurdering}
                settVurderingEndret={settVurderingEndret}
            />
            <InnstillingTilNavKlageinstansAvsnitt
                tittel="Vurdering av klagen"
                verdi={oppdatertVurdering.vurderingAvKlagen}
                felt="vurderingAvKlagen"
                settIkkePersistertKomponent={settIkkePersistertKomponent}
                settOppdatertVurdering={settOppdatertVurdering}
                settVurderingEndret={settVurderingEndret}
            />
        </StyledAccordion>
    );
};
