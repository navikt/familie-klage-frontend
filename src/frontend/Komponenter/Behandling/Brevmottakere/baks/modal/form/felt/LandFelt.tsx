import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { EøsLandvelger } from '../../../../../../../Felles/Landvelger/EøsLandvelger';
import { BrevmottakerFeltnavn, BrevmottakerFeltProps } from './felttyper';
import { IPersonopplysninger } from '../../../../../../../App/typer/personopplysninger';
import { erGyldigMottakerRolleForLandkode, MottakerRolle } from '../../../../mottakerRolle';
import { utledBrevmottakerPersonUtenIdentNavnVedDødsbo } from '../../../../brevmottaker';

type Props = BrevmottakerFeltProps & {
    personopplysninger: IPersonopplysninger;
};

export function LandFelt({ feltnavn, visningsnavn, erLesevisning, personopplysninger }: Props) {
    const { control, getValues, setValue, formState } = useFormContext();
    return (
        <Controller
            control={control}
            rules={{
                required: `${visningsnavn} er påkrevd.`,
                validate: (landkode) => {
                    const mottakerRolle = getValues(BrevmottakerFeltnavn.MOTTAKERROLLE);
                    if (!erGyldigMottakerRolleForLandkode(mottakerRolle, landkode)) {
                        return 'Norge kan ikke være satt for bruker med utenlandsk adresse.';
                    }
                    return undefined;
                },
                deps: [BrevmottakerFeltnavn.POSTNUMMER, BrevmottakerFeltnavn.POSTSTED],
            }}
            name={feltnavn}
            render={({ field, fieldState }) => {
                const visFeilmelding = fieldState.isTouched || formState.isSubmitted;
                return (
                    <EøsLandvelger
                        label={visningsnavn}
                        onBlur={field.onBlur}
                        value={field.value}
                        onToggleSelected={(landkode, isSelected) => {
                            const mottakerRolle = getValues(BrevmottakerFeltnavn.MOTTAKERROLLE);
                            if (isSelected && mottakerRolle === MottakerRolle.DØDSBO) {
                                setValue(
                                    BrevmottakerFeltnavn.NAVN,
                                    utledBrevmottakerPersonUtenIdentNavnVedDødsbo(
                                        personopplysninger.navn,
                                        landkode
                                    )
                                );
                            }
                            field.onChange(isSelected ? landkode : '');
                        }}
                        error={visFeilmelding && fieldState.error?.message}
                        readOnly={erLesevisning || formState.isSubmitting}
                    />
                );
            }}
        />
    );
}
