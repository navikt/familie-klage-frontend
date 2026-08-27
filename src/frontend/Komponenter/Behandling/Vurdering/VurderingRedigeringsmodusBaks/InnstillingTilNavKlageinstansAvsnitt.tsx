import { Accordion } from '@navikt/ds-react';
import React from 'react';
import type { VurderingAccordionFelter } from './felttyper';
import { Tekstfelt } from './Tekstfelt';

interface Props {
    visningsnavn: string;
    feltnavn: keyof VurderingAccordionFelter;
    åpen: boolean;
    toggleÅpen: (feltnavn: keyof VurderingAccordionFelter) => void;
}

export const InnstillingTilNavKlageinstansAvsnitt = ({
    visningsnavn,
    feltnavn,
    åpen,
    toggleÅpen,
}: Props) => {
    return (
        <Accordion.Item open={åpen}>
            <Accordion.Header onClick={() => toggleÅpen(feltnavn)}>{visningsnavn}</Accordion.Header>
            <Accordion.Content>
                <Tekstfelt visningsnavn={visningsnavn} feltnavn={feltnavn} />
            </Accordion.Content>
        </Accordion.Item>
    );
};
