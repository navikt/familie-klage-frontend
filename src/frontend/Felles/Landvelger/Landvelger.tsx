import React, { forwardRef, LegacyRef } from 'react';

import { ComboboxProps, UNSAFE_Combobox } from '@navikt/ds-react';

import { ComboboxOption } from '@navikt/ds-react/cjs/form/combobox/types';

type Props = {
    label: React.ReactNode;
} & Omit<ComboboxProps, 'options'>;

const countries: ComboboxOption[] = [
    { value: 'BE', label: 'Belgia' },
    { value: 'BG', label: 'Bulgaria' },
    { value: 'DK', label: 'Danmark' },
    { value: 'EE', label: 'Estland' },
    { value: 'FI', label: 'Finland' },
    { value: 'FR', label: 'Frankrike' },
    { value: 'GR', label: 'Hellas' },
    { value: 'IE', label: 'Irland' },
    { value: 'IS', label: 'Island' },
    { value: 'IT', label: 'Italia' },
    { value: 'HR', label: 'Kroatia' },
    { value: 'CY', label: 'Kypros' },
    { value: 'LV', label: 'Latvia' },
    { value: 'LI', label: 'Liechtenstein' },
    { value: 'LT', label: 'Litauen' },
    { value: 'LU', label: 'Luxembourg' },
    { value: 'MT', label: 'Malta' },
    { value: 'NL', label: 'Nederland' },
    { value: 'NO', label: 'Norge' },
    { value: 'PL', label: 'Polen' },
    { value: 'PT', label: 'Portugal' },
    { value: 'RO', label: 'Romania' },
    { value: 'SK', label: 'Slovakia' },
    { value: 'SI', label: 'Slovenia' },
    { value: 'ES', label: 'Spania' },
    { value: 'CH', label: 'Sveits' },
    { value: 'SE', label: 'Sverige' },
    { value: 'CZ', label: 'Tsjekkia' },
    { value: 'DE', label: 'Tyskland' },
    { value: 'HU', label: 'Ungarn' },
    { value: 'AT', label: 'Østerrike' },
];

const Landvelger = forwardRef((props: Props, ref: LegacyRef<HTMLInputElement>) => {
    const { label, onToggleSelected, error } = props;
    return (
        <UNSAFE_Combobox
            ref={ref}
            label={label}
            options={countries}
            onToggleSelected={onToggleSelected}
            error={error}
            shouldAutocomplete={true}
        />
    );
});

Landvelger.displayName = 'Landvelger';

export default Landvelger;
