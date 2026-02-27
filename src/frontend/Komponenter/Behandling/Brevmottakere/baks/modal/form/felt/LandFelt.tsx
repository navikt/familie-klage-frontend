import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { EøsLandvelger } from '../../../../../../../Felles/Landvelger/EøsLandvelger';
import { erGyldigMottakerRolleForLandkode, MottakerRolle } from '../../../../mottakerRolle';
import { utledBrevmottakerPersonUtenIdentNavnVedDødsbo } from '../../../../brevmottaker';
import {
    BrevmottakerPersonUtenIdentFeltnavn,
    BrevmottakerPersonUtenIdentFormValues,
} from '../BrevmottakerPersonUtenIdentForm';
import { EøsLandkode } from '../../../../../../../Felles/Landvelger/landkode';
import { usePersonopplysningerContext } from '../../../../../../../App/context/PersonopplysningerContext';

interface Props {
    erLesevisning?: boolean;
}

const label = 'Land';

export function LandFelt({ erLesevisning = false }: Props) {
    const { control, getValues, setValue, resetField } =
        useFormContext<BrevmottakerPersonUtenIdentFormValues>();

    const { navn } = usePersonopplysningerContext();

    const { field, fieldState, formState } = useController({
        name: BrevmottakerPersonUtenIdentFeltnavn.LANDKODE,
        control,
        rules: {
            validate: (landkode) => {
                if (landkode === '') {
                    return `${label} er påkrevd.`;
                }
                const mottakerRolle = getValues(BrevmottakerPersonUtenIdentFeltnavn.MOTTAKERROLLE);
                if (mottakerRolle === '') {
                    return undefined;
                }
                if (!erGyldigMottakerRolleForLandkode(mottakerRolle, landkode)) {
                    return 'Norge kan ikke være satt for bruker med utenlandsk adresse.';
                }
                return undefined;
            },
        },
    });

    function onSelect(landkode: EøsLandkode) {
        if (landkode !== EøsLandkode.NO) {
            resetField(BrevmottakerPersonUtenIdentFeltnavn.POSTNUMMER);
            resetField(BrevmottakerPersonUtenIdentFeltnavn.POSTSTED);
        }
        const mottakerRolle = getValues(BrevmottakerPersonUtenIdentFeltnavn.MOTTAKERROLLE);
        if (mottakerRolle === MottakerRolle.DØDSBO) {
            const nyttPreutfyltNavn = utledBrevmottakerPersonUtenIdentNavnVedDødsbo(navn, landkode);
            setValue(BrevmottakerPersonUtenIdentFeltnavn.NAVN, nyttPreutfyltNavn);
        }
        field.onChange(landkode);
    }

    return (
        <EøsLandvelger
            label={label}
            name={field.name}
            ref={field.ref}
            onBlur={field.onBlur}
            value={field.value}
            onSelect={onSelect}
            error={fieldState.error?.message}
            readOnly={erLesevisning || formState.isSubmitting}
        />
    );
}
