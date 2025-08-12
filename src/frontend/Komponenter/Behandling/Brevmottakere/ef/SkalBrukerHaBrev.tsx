import React, { Dispatch, FC, SetStateAction } from 'react';
import { IPersonopplysninger } from '../../../../App/typer/personopplysninger';
import { BodyShort, Radio, RadioGroup } from '@navikt/ds-react';
import { MottakerRolle } from '../mottakerRolle';
import { BrevmottakerPerson } from '../brevmottaker';

interface Props {
    valgteBrevmottakere: BrevmottakerPerson[];
    settValgtBrevMottakere: Dispatch<SetStateAction<BrevmottakerPerson[]>>;
    personopplysninger: IPersonopplysninger;
}

export const SkalBrukerHaBrev: FC<Props> = ({
    valgteBrevmottakere,
    settValgtBrevMottakere,
    personopplysninger,
}) => {
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
                          personIdent: personopplysninger.personIdent,
                          navn: personopplysninger.navn,
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
