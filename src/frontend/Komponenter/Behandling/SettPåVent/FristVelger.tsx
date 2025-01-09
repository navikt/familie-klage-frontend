import React, { FC } from 'react';
import { useDatepicker, DatePicker } from '@navikt/ds-react';
import { nullableTilDato, tilLocaleDateString } from '../../../App/utils/dato';
import { formaterNullableIsoDato } from '../../../App/utils/formatter';
import { IOppgave } from './Typer/IOppgave';

export const FristVelger: FC<{
    oppgave: IOppgave;
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
