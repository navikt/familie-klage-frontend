import React from 'react';
import { Search } from '@navikt/ds-react';
import { useController, useFormContext } from 'react-hook-form';
import { BrevmottakerOrganisasjonFeltnavn } from './OrganisasjonForm/BrevmottakerOrganisasjonForm';

interface Props {
    hentOgSettOrganisasjon: (orgNr: string) => void;
    erLesevisning?: boolean;
}

const label = 'Organisasjonsnummer';

export function OrganisasjonSøk({ hentOgSettOrganisasjon, erLesevisning }: Props) {
    const { control, trigger, setValue, watch } = useFormContext();

    const {
        field: { ref, value, onBlur, onChange },
        fieldState: { error },
        formState: { isSubmitting },
    } = useController({
        name: BrevmottakerOrganisasjonFeltnavn.ORGANISASJONSNUMMER,
        control,
        rules: {
            required: `${label} er påkrevd.`,
            validate: validerOrganisasjonsnummer,
        },
    });

    const organisasjonsnavn = watch(BrevmottakerOrganisasjonFeltnavn.ORGANISASJONSNAVN);
    const onChangeWithReset = (value: string) => {
        if (organisasjonsnavn) {
            setValue(BrevmottakerOrganisasjonFeltnavn.ORGANISASJONSNAVN, '');
        }
        onChange(value);
    };

    return (
        <Search
            label={label}
            ref={ref}
            value={value}
            onChange={onChangeWithReset}
            onBlur={onBlur}
            error={error?.message}
            readOnly={erLesevisning || isSubmitting}
            hideLabel={false}
        >
            <Search.Button
                type="button"
                onClick={() => {
                    trigger(BrevmottakerOrganisasjonFeltnavn.ORGANISASJONSNUMMER).then(
                        (isValid) => isValid && hentOgSettOrganisasjon(value)
                    );
                }}
            />
        </Search>
    );
}

const validerOrganisasjonsnummer = (organisasjonsnummer: string): string | undefined => {
    if (!/^\d{9}$/.test(organisasjonsnummer)) {
        return 'Organisasjonsnummer må bestå av 9 siffer.';
    }

    const sifre = organisasjonsnummer.split('').map(Number);
    const vekter = [3, 2, 7, 6, 5, 4, 3, 2];
    const kontrollsiffer = sifre[8];
    const beregnetKontrollsiffer =
        11 -
        (sifre.slice(0, 8).reduce((acc, siffer, index) => acc + siffer * vekter[index], 0) % 11);

    if (beregnetKontrollsiffer !== kontrollsiffer) {
        return 'Ugyldig organisasjonsnummer.';
    }
    return undefined;
};
