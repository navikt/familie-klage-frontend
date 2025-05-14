import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { EøsLandvelger } from '../../../../../../../Felles/Landvelger/EøsLandvelger';
import { IPersonopplysninger } from '../../../../../../../App/typer/personopplysninger';
import { erGyldigMottakerRolleForLandkode, MottakerRolle } from '../../../../mottakerRolle';
import { utledBrevmottakerPersonUtenIdentNavnVedDødsbo } from '../../../../brevmottaker';
import { BrevmottakerFeltnavn, BrevmottakerFormValues } from '../BrevmottakerForm';

interface Props {
    personopplysninger: IPersonopplysninger;
    erLesevisning?: boolean;
}

const label = 'Land';

export function LandFelt({ personopplysninger, erLesevisning = false }: Props) {
    const { control, getValues, setValue } = useFormContext<BrevmottakerFormValues>();

    const { field, fieldState, formState } = useController({
        name: BrevmottakerFeltnavn.LANDKODE,
        control,
        rules: {
            validate: (landkode) => {
                if (landkode === '') {
                    return `${label} er påkrevd.`;
                }
                const mottakerRolle = getValues(BrevmottakerFeltnavn.MOTTAKERROLLE);
                if (mottakerRolle === '') {
                    return undefined;
                }
                if (!erGyldigMottakerRolleForLandkode(mottakerRolle, landkode)) {
                    return 'Norge kan ikke være satt for bruker med utenlandsk adresse.';
                }
                return undefined;
            },
            deps: [BrevmottakerFeltnavn.POSTNUMMER, BrevmottakerFeltnavn.POSTSTED],
        },
    });

    function onToggleSelected(value: string, isSelected: boolean) {
        const landkode = value as BrevmottakerFormValues[BrevmottakerFeltnavn.LANDKODE];
        const harValgtLand = landkode !== '';

        const erDødsbo = getValues(BrevmottakerFeltnavn.MOTTAKERROLLE) === MottakerRolle.DØDSBO;

        if (isSelected && erDødsbo && harValgtLand) {
            const nyttNavn = utledBrevmottakerPersonUtenIdentNavnVedDødsbo(
                personopplysninger.navn,
                landkode
            );
            setValue(BrevmottakerFeltnavn.NAVN, nyttNavn);
        }

        field.onChange(isSelected ? landkode : '');
    }

    return (
        <EøsLandvelger
            label={label}
            onBlur={field.onBlur}
            value={field.value}
            onToggleSelected={onToggleSelected}
            error={fieldState.error?.message}
            readOnly={erLesevisning || formState.isSubmitting}
        />
    );
}
