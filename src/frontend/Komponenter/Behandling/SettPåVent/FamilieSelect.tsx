import { BodyShort, Label, Select, SelectProps } from '@navikt/ds-react';
import React from 'react';

export interface FamilieSelectProps extends SelectProps {
    erLesevisning?: boolean;
    lesevisningVerdi?: string;
}

const FamilieSelect: React.FC<FamilieSelectProps> = ({
    children,
    className,
    erLesevisning = false,
    label,
    lesevisningVerdi,
    value,
    size,
    hideLabel,
    ...props
}) => {
    return erLesevisning ? (
        <div className={className}>
            {!hideLabel && label && <Label size={size}>{label}</Label>}
            <BodyShort size={size}>{lesevisningVerdi ? lesevisningVerdi : value}</BodyShort>
        </div>
    ) : (
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

export default FamilieSelect;
