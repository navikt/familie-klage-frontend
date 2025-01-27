import React, { Dispatch, FC, SetStateAction } from 'react';
import { IPersonopplysninger } from '../../../../App/typer/personopplysninger';
import styled from 'styled-components';
import { Ingress, Radio, RadioGroup } from '@navikt/ds-react';
import { MottakerRolle } from '../mottakerRolle';
import { BrevmottakerPerson } from '../brevmottakerPerson';

const StyledRadioGruppe = styled(RadioGroup)`
    display: flex;

    > div {
        margin-right: 2rem;
    }
`;

const Underoverskrift = styled(Ingress)`
    margin-bottom: 1rem;
`;

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

            if (brukerErIListe) {
                const mottakereUtenBruker = mottakere.filter(
                    (mottaker) => mottaker.mottakerRolle !== MottakerRolle.BRUKER
                );

                return mottakereUtenBruker;
            } else {
                const mottakereMedBruker = [
                    {
                        mottakerRolle: MottakerRolle.BRUKER,
                        personIdent: personopplysninger.personIdent,
                        navn: personopplysninger.navn,
                    },
                    ...mottakere,
                ];
                return mottakereMedBruker;
            }
        });
    };

    return (
        <>
            <Underoverskrift>Skal bruker motta brevet?</Underoverskrift>
            <StyledRadioGruppe
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
            </StyledRadioGruppe>
        </>
    );
};
