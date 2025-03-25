import React from 'react';
import { Accordion } from '@navikt/ds-react';
import { EnsligTextArea } from '../../../../Felles/Input/EnsligTextArea';
import { IVurdering } from '../vurderingValg';

interface IProps {
    tittel: string;
    verdi: string | undefined;
    felt: keyof IVurdering;
    settIkkePersistertKomponent: (verdi: string) => void;
    settOppdatertVurdering: (vurdering: React.SetStateAction<IVurdering>) => void;
    settVurderingEndret: (endret: boolean) => void;
}

export const InnstillingTilNavKlageinstansAvsnitt = ({
    tittel,
    verdi,
    felt,
    settIkkePersistertKomponent,
    settOppdatertVurdering,
    settVurderingEndret,
}: IProps) => {
    return (
        <Accordion.Item>
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
