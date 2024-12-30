import React, { FC } from 'react';
import { useDatepicker, DatePicker } from '@navikt/ds-react';
import { nullableTilDato, tilLocaleDateString } from '../../../App/utils/dato';
import { Oppgave } from '../Typer/Oppgave';
import { formaterNullableIsoDato } from '../../../App/utils/formatter';

export const FristVelger: FC<{
    oppgave: Oppgave;
    frist: string | undefined;
    settFrist: (frist: string | undefined) => void;
    erLesevisning: boolean;
}> = ({ oppgave, frist, settFrist, erLesevisning }) => {
    const { datepickerProps, inputProps } = useDatepicker({
        defaultSelected: nullableTilDato(oppgave.fristFerdigstillelse),
        onDateChange: (dato) => settFrist(dato && tilLocaleDateString(dato)),
    });

    const dagensDato = new Date();

    const formatertFristDato = formaterNullableIsoDato(frist);

    return (
        <DatePicker {...datepickerProps} fromDate={dagensDato}>
            <DatePicker.Input
                label={'Frist'}
                {...inputProps}
                value={formatertFristDato}
                size={'small'}
                readOnly={erLesevisning}
            />
        </DatePicker>
    );
};
