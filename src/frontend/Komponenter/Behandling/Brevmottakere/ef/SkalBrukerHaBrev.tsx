import React, { Dispatch, FC, SetStateAction } from 'react';
import { BodyShort, Radio, RadioGroup } from '@navikt/ds-react';
import { MottakerRolle } from '../mottakerRolle';
import { BrevmottakerPerson } from '../brevmottaker';
import { usePersonopplysningerContext } from '../../../../App/context/PersonopplysningerContext';

interface Props {
    valgteBrevmottakere: BrevmottakerPerson[];
    settValgtBrevMottakere: Dispatch<SetStateAction<BrevmottakerPerson[]>>;
}

export const SkalBrukerHaBrev: FC<Props> = ({ valgteBrevmottakere, settValgtBrevMottakere }) => {
    const { navn, personIdent } = usePersonopplysningerContext();
    const brukerSkalHaBrev = valgteBrevmottakere.some(
        (mottaker) => mottaker.mottakerRolle === MottakerRolle.BRUKER
    );

    const toggleBrukerSkalHaBrev = () => {
        settValgtBrevMottakere((mottakere) => {
            const brukerErIListe = mottakere.some(
                (mottaker) => mottaker.mottakerRolle === MottakerRolle.BRUKER
            );

            // Returnerer mottakerliste ekskludert bruker eller mottakerliste inkludert bruker
            return brukerErIListe
                ? mottakere.filter((mottaker) => mottaker.mottakerRolle !== MottakerRolle.BRUKER)
                : [
                      {
                          mottakerRolle: MottakerRolle.BRUKER,
                          personIdent,
                          navn,
                      },
                      ...mottakere,
                  ];
        });
    };

    return (
        <>
            <BodyShort size="large" spacing>
                Skal bruker motta brevet?
            </BodyShort>
            <RadioGroup
                legend={'Skal bruker motta brevet?'}
                hideLegend
                value={brukerSkalHaBrev ? 'Ja' : 'Nei'}
            >
                <Radio value={'Ja'} name={'brukerHaBrevRadio'} onChange={toggleBrukerSkalHaBrev}>
                    Ja
                </Radio>
                <Radio value={'Nei'} name={'brukerHaBrevRadio'} onChange={toggleBrukerSkalHaBrev}>
                    Nei
                </Radio>
            </RadioGroup>
        </>
    );
};
