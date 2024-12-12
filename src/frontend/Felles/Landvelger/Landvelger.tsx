import * as React from 'react';

import classNames from 'classnames';
import styled from 'styled-components';

import { Label } from '@navikt/ds-react';
import { ASpacing2 } from '@navikt/ds-tokens/dist/tokens';
import { CountryFilter } from '@navikt/land-verktoy';
import type { Country } from '@navikt/land-verktoy';
import type { CountrySelectProps } from '@navikt/landvelger';
import CountrySelect from '@navikt/landvelger';

const Landvelger = styled(CountrySelect)`
    display: grid;
    gap: ${ASpacing2};
    margin-bottom: ${(props) => (props.utenMargin ? '0rem' : '1rem')};
`;

interface IBaseLandvelgerProps {
    countrySelectProps: CountrySelectProps<Country>;
    label: string | JSX.Element;
    className?: string;
    utenMargin: boolean;
    kanNullstilles: boolean;
    feil?: string;
    size?: 'small' | 'medium';
}

const BaseFamilieLandvelger: React.FC<IBaseLandvelgerProps> = ({
    countrySelectProps,
    label,
    className,
    utenMargin,
    kanNullstilles,
    feil,
    size,
}) => {
    return (
        <div className={classNames('skjemaelement', className)}>
            <Landvelger
                utenMargin={utenMargin}
                kanNullstilles={kanNullstilles}
                feil={feil}
                {...countrySelectProps}
                place
                label={<Label size={size}>{label}</Label>}
            />
        </div>
    );
};

interface IBaseFamilieLandvelgerProps {
    id: string;
    className?: string;
    value?: string | string[] | undefined;
    feil?: string;
    label: string | JSX.Element;
    placeholder?: string | undefined;
    kunEøs?: boolean;
    medFlag?: boolean;
    medWave?: boolean;
    sirkulær?: boolean;
    size?: 'small' | 'medium';
    erLesevisning?: boolean;
    utenMargin?: boolean;
    kanNullstilles?: boolean;
}

interface IFamilieLandvelgerProps extends IBaseFamilieLandvelgerProps {
    onChange: (value: Country) => void;
    eksluderLand?: string[];
}

const FamilieLandvelger: React.FC<IFamilieLandvelgerProps> = ({
    className,
    value,
    feil,
    label,
    placeholder,
    kunEøs = false,
    sirkulær = false,
    size = 'small',
    medFlag = false,
    medWave = false,
    erLesevisning = false,
    onChange,
    utenMargin = false,
    kanNullstilles = false,
    eksluderLand = undefined,
}) => {
    const id = `country-select-${label}`;

    const landvelgerProps: CountrySelectProps<Country> = {
        id,
        values: value,
        placeholder,
        error: feil ? feil : undefined,
        isMulti: false,
        type: 'country',
        flags: medFlag,
        flagWave: medFlag && medWave,
        flagType: sirkulær ? 'circle' : 'original',
        closeMenuOnSelect: true,
        size,
        isDisabled: erLesevisning,
        onOptionSelected: onChange,
        isClearable: kanNullstilles,
        includeList: kunEøs ? CountryFilter.EEA({}) : undefined,
        excludeList: eksluderLand,
    };
    return (
        <BaseFamilieLandvelger
            countrySelectProps={landvelgerProps}
            label={label}
            className={className}
            utenMargin={utenMargin}
            kanNullstilles={kanNullstilles}
            feil={feil}
            size={size}
        />
    );
};

export { FamilieLandvelger };
