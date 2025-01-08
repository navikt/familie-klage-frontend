import React, { forwardRef, LegacyRef, useState } from 'react';

import { ComboboxProps, UNSAFE_Combobox } from '@navikt/ds-react';

import { ComboboxOption } from '@navikt/ds-react/cjs/form/combobox/types';
import { EøsLandkode } from './landkode';

type Props = {
    label: React.ReactNode;
} & Omit<ComboboxProps, 'options'>;

const eøsLand: ComboboxOption[] = [
    { value: EøsLandkode.BE, label: 'Belgia' },
    { value: EøsLandkode.BG, label: 'Bulgaria' },
    { value: EøsLandkode.DK, label: 'Danmark' },
    { value: EøsLandkode.EE, label: 'Estland' },
    { value: EøsLandkode.FI, label: 'Finland' },
    { value: EøsLandkode.FR, label: 'Frankrike' },
    { value: EøsLandkode.GR, label: 'Hellas' },
    { value: EøsLandkode.IE, label: 'Irland' },
    { value: EøsLandkode.IS, label: 'Island' },
    { value: EøsLandkode.IT, label: 'Italia' },
    { value: EøsLandkode.HR, label: 'Kroatia' },
    { value: EøsLandkode.CY, label: 'Kypros' },
    { value: EøsLandkode.LV, label: 'Latvia' },
    { value: EøsLandkode.LI, label: 'Liechtenstein' },
    { value: EøsLandkode.LT, label: 'Litauen' },
    { value: EøsLandkode.LU, label: 'Luxembourg' },
    { value: EøsLandkode.MT, label: 'Malta' },
    { value: EøsLandkode.NL, label: 'Nederland' },
    { value: EøsLandkode.NO, label: 'Norge' },
    { value: EøsLandkode.PL, label: 'Polen' },
    { value: EøsLandkode.PT, label: 'Portugal' },
    { value: EøsLandkode.RO, label: 'Romania' },
    { value: EøsLandkode.SK, label: 'Slovakia' },
    { value: EøsLandkode.SI, label: 'Slovenia' },
    { value: EøsLandkode.ES, label: 'Spania' },
    { value: EøsLandkode.CH, label: 'Sveits' },
    { value: EøsLandkode.SE, label: 'Sverige' },
    { value: EøsLandkode.CZ, label: 'Tsjekkia' },
    { value: EøsLandkode.DE, label: 'Tyskland' },
    { value: EøsLandkode.HU, label: 'Ungarn' },
    { value: EøsLandkode.AT, label: 'Østerrike' },
];

export const EøsLandvelger = forwardRef((props: Props, ref: LegacyRef<HTMLInputElement>) => {
    const { label, value, onToggleSelected, error, onBlur, readOnly } = props;
    const [selectedOption, setSelectedOption] = useState<ComboboxOption | undefined>(
        eøsLand.find((opt) => opt.value === value)
    );
    return (
        <UNSAFE_Combobox
            ref={ref}
            label={label}
            options={eøsLand}
            onBlur={onBlur}
            isMultiSelect={false}
            selectedOptions={selectedOption ? [selectedOption] : []}
            onToggleSelected={(option, isSelected) => {
                const newOption = eøsLand.find((opt) => opt.value === option);
                if (newOption === selectedOption || newOption == undefined) {
                    setSelectedOption(undefined);
                } else {
                    setSelectedOption(newOption);
                }
                if (onToggleSelected) {
                    onToggleSelected(option, isSelected, false);
                }
            }}
            error={error}
            shouldAutocomplete={true}
            readOnly={readOnly}
        />
    );
});

EøsLandvelger.displayName = 'Landvelger';
