import React, { forwardRef, LegacyRef, useState } from 'react';

import { ComboboxProps, UNSAFE_Combobox } from '@navikt/ds-react';

import { ComboboxOption } from '@navikt/ds-react/cjs/form/combobox/types';

type Props = {
    label: React.ReactNode;
} & Omit<ComboboxProps, 'options'>;

export enum Landkoder {
    BE = 'BE',
    BG = 'BG',
    DK = 'DK',
    EE = 'EE',
    FI = 'FI',
    FR = 'FR',
    GR = 'GR',
    IE = 'IE',
    IS = 'IS',
    IT = 'IT',
    HR = 'HR',
    CY = 'CY',
    LV = 'LV',
    LI = 'LI',
    LT = 'LT',
    LU = 'LU',
    MT = 'MT',
    NL = 'NL',
    NO = 'NO',
    PL = 'PL',
    PT = 'PT',
    RO = 'RO',
    SK = 'SK',
    SI = 'SI',
    ES = 'ES',
    CH = 'CH',
    SE = 'SE',
    CZ = 'CZ',
    DE = 'DE',
    HU = 'HU',
    AT = 'AT',
}

const land: ComboboxOption[] = [
    { value: Landkoder.BE, label: 'Belgia' },
    { value: Landkoder.BG, label: 'Bulgaria' },
    { value: Landkoder.DK, label: 'Danmark' },
    { value: Landkoder.EE, label: 'Estland' },
    { value: Landkoder.FI, label: 'Finland' },
    { value: Landkoder.FR, label: 'Frankrike' },
    { value: Landkoder.GR, label: 'Hellas' },
    { value: Landkoder.IE, label: 'Irland' },
    { value: Landkoder.IS, label: 'Island' },
    { value: Landkoder.IT, label: 'Italia' },
    { value: Landkoder.HR, label: 'Kroatia' },
    { value: Landkoder.CY, label: 'Kypros' },
    { value: Landkoder.LV, label: 'Latvia' },
    { value: Landkoder.LI, label: 'Liechtenstein' },
    { value: Landkoder.LT, label: 'Litauen' },
    { value: Landkoder.LU, label: 'Luxembourg' },
    { value: Landkoder.MT, label: 'Malta' },
    { value: Landkoder.NL, label: 'Nederland' },
    { value: Landkoder.NO, label: 'Norge' },
    { value: Landkoder.PL, label: 'Polen' },
    { value: Landkoder.PT, label: 'Portugal' },
    { value: Landkoder.RO, label: 'Romania' },
    { value: Landkoder.SK, label: 'Slovakia' },
    { value: Landkoder.SI, label: 'Slovenia' },
    { value: Landkoder.ES, label: 'Spania' },
    { value: Landkoder.CH, label: 'Sveits' },
    { value: Landkoder.SE, label: 'Sverige' },
    { value: Landkoder.CZ, label: 'Tsjekkia' },
    { value: Landkoder.DE, label: 'Tyskland' },
    { value: Landkoder.HU, label: 'Ungarn' },
    { value: Landkoder.AT, label: 'Østerrike' },
];

const Landvelger = forwardRef((props: Props, ref: LegacyRef<HTMLInputElement>) => {
    const { label, value, onToggleSelected, error, onBlur } = props;
    const [selectedOption, setSelectedOption] = useState<ComboboxOption | undefined>(
        land.find((opt) => opt.value === value)
    );
    return (
        <UNSAFE_Combobox
            ref={ref}
            label={label}
            options={land}
            onBlur={onBlur}
            isMultiSelect={false}
            selectedOptions={selectedOption ? [selectedOption] : []}
            onToggleSelected={(option, isSelected) => {
                const newOption = land.find((opt) => opt.value === option);
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
        />
    );
});

Landvelger.displayName = 'Landvelger';

export default Landvelger;
