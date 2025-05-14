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

    return (
        <EøsLandvelger
            label={label}
            onBlur={field.onBlur}
            value={field.value}
            onToggleSelected={(value, isSelected) => {
                const landkode = value as BrevmottakerFormValues[BrevmottakerFeltnavn.LANDKODE];
                const mottakerRolle = getValues(BrevmottakerFeltnavn.MOTTAKERROLLE);
                if (isSelected && mottakerRolle === MottakerRolle.DØDSBO && landkode !== '') {
                    const nyttNavn = utledBrevmottakerPersonUtenIdentNavnVedDødsbo(
                        personopplysninger.navn,
                        landkode
                    );
                    setValue(BrevmottakerFeltnavn.NAVN, nyttNavn);
                }
                field.onChange(isSelected ? landkode : '');
            }}
            error={fieldState.error?.message}
            readOnly={erLesevisning || formState.isSubmitting}
        />
    );
}
