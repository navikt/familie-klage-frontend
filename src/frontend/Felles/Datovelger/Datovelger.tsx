import React, { FC } from 'react';
import { useDatepicker, DatePicker, BodyShort } from '@navikt/ds-react';
import { formaterNullableIsoDato, tilLocaleDateString } from '../../App/utils/formatter';
import { nullableTilDato } from '../../App/utils/dato';

export const Datovelger: FC<{
    verdi: string | undefined;
    settVerdi: (verdi: string | undefined) => void;
    erLesevisning?: boolean;
    id: string;
    feil?: string;
    maksDato?: Date;
    minDato?: Date;
    placeholder?: string;
}> = ({ settVerdi, erLesevisning, verdi, id, feil, minDato, maksDato, placeholder }) => {
    const { datepickerProps, inputProps } = useDatepicker({
        defaultSelected: nullableTilDato(verdi),
        onDateChange: (dato) => settVerdi(dato && tilLocaleDateString(dato)),
        toDate: maksDato,
        fromDate: minDato ?? new Date('1 Jan 1990'),
    });

    if (erLesevisning) {
        return <BodyShort size="small">{formaterNullableIsoDato(verdi)}</BodyShort>;
    }

    return (
        <DatePicker id={id} {...datepickerProps} dropdownCaption>
            <DatePicker.Input
                label=""
                placeholder={placeholder}
                {...inputProps}
                error={feil}
                size="medium"
            />
        </DatePicker>
    );
};
