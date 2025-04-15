import React from 'react';
import { Accordion } from '@navikt/ds-react';
import { Tekstfelt } from './Tekstfelt';
import { AccordionTilstand } from './InnstillingTilNavKlageinstans';

interface Props {
    visningsnavn: string;
    feltnavn: keyof AccordionTilstand;
    åpen: boolean;
    toggleÅpen: (feltnavn: keyof AccordionTilstand) => void;
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
