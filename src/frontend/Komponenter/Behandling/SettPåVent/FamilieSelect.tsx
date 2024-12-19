import { Select, SelectProps } from '@navikt/ds-react';
import React from 'react';

export interface FamilieSelectProps extends SelectProps {
    erLesevisning?: boolean;
    lesevisningVerdi?: string;
}

export const FamilieSelect: React.FC<FamilieSelectProps> = ({
    children,
    className,
    erLesevisning = false,
    label,
    value,
    size,
    hideLabel,
    ...props
}) => {
    return (
        <Select
            className={className}
            label={label}
            value={value}
            size={size}
            readOnly={erLesevisning}
            hideLabel={hideLabel}
            {...props}
        >
            {children}
        </Select>
    );
};
