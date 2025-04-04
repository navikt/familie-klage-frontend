import React from 'react';
import { Accordion } from '@navikt/ds-react';
import { EnsligTextArea } from '../../../../Felles/Input/EnsligTextArea';
import { IVurdering } from '../vurderingValg';

interface Props {
    tittel: string;
    verdi: string | undefined;
    felt: keyof IVurdering;
    settIkkePersistertKomponent: (verdi: string) => void;
    settOppdatertVurdering: (vurdering: React.SetStateAction<IVurdering>) => void;
    settVurderingEndret: (endret: boolean) => void;
    defaultOpen?: boolean;
}

export const InnstillingTilNavKlageinstansAvsnitt = ({
    tittel,
    verdi,
    felt,
    settIkkePersistertKomponent,
    settOppdatertVurdering,
    settVurderingEndret,
    defaultOpen,
}: Props) => {
    return (
        <Accordion.Item defaultOpen={defaultOpen}>
            <Accordion.Header>{tittel}</Accordion.Header>
            <Accordion.Content>
                <EnsligTextArea
                    label="Skriv tekst"
                    value={verdi}
                    onChange={(e) => {
                        settIkkePersistertKomponent(e.target.value);
                        settOppdatertVurdering((tidligereTilstand) => ({
                            ...tidligereTilstand,
                            [felt]: e.target.value,
                        }));
                        settVurderingEndret(true);
                    }}
                    size="medium"
                    readOnly={false}
                />
            </Accordion.Content>
        </Accordion.Item>
    );
};
