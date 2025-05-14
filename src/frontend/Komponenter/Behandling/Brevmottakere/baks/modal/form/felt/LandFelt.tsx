import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { EøsLandvelger } from '../../../../../../../Felles/Landvelger/EøsLandvelger';
import { BrevmottakerFeltnavn } from './felttyper';
import { IPersonopplysninger } from '../../../../../../../App/typer/personopplysninger';
import { erGyldigMottakerRolleForLandkode, MottakerRolle } from '../../../../mottakerRolle';
import { utledBrevmottakerPersonUtenIdentNavnVedDødsbo } from '../../../../brevmottaker';
import { BrevmottakerFormValues } from '../BrevmottakerForm';
import { EøsLandkode } from '../../../../../../../Felles/Landvelger/landkode';

interface Props {
    personopplysninger: IPersonopplysninger;
    erLesevisning?: boolean;
}

const visningsnavn = 'Land';

export function LandFelt({ personopplysninger, erLesevisning = false }: Props) {
    const { control, getValues, setValue } = useFormContext<BrevmottakerFormValues>();

    const { field, fieldState, formState } = useController({
        name: BrevmottakerFeltnavn.LANDKODE,
        control,
        rules: {
            validate: (landkode) => {
                if (landkode === '') {
                    return `${visningsnavn} er påkrevd.`;
                }
                const mottakerRolle = getValues(BrevmottakerFeltnavn.MOTTAKERROLLE);
                if (mottakerRolle === '') {
                    return undefined;
                }
                if (!erGyldigMottakerRolleForLandkode(mottakerRolle, landkode as EøsLandkode)) {
                    return 'Norge kan ikke være satt for bruker med utenlandsk adresse.';
                }
                return undefined;
            },
            deps: [BrevmottakerFeltnavn.POSTNUMMER, BrevmottakerFeltnavn.POSTSTED],
        },
    });

    const visFeilmelding = fieldState.isTouched || formState.isSubmitted;

    return (
        <EøsLandvelger
            label={visningsnavn}
            onBlur={field.onBlur}
            value={field.value}
            onToggleSelected={(value, isSelected) => {
                const mottakerRolle = getValues(BrevmottakerFeltnavn.MOTTAKERROLLE);
                if (isSelected && mottakerRolle === MottakerRolle.DØDSBO) {
                    const landkode = EøsLandkode[value as keyof typeof EøsLandkode];
                    const nyttNavn = utledBrevmottakerPersonUtenIdentNavnVedDødsbo(
                        personopplysninger.navn,
                        landkode
                    );
                    setValue(BrevmottakerFeltnavn.NAVN, nyttNavn);
                }
                field.onChange(isSelected ? value : '');
            }}
            error={visFeilmelding && fieldState.error?.message}
            readOnly={erLesevisning || formState.isSubmitting}
        />
    );
}
