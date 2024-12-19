import React, { FC } from 'react';
import { useDatepicker, DatePicker } from '@navikt/ds-react';
import { nullableTilDato, tilLocaleDateString } from '../../../App/utils/dato';
import { IOppgave } from './IOppgave';

export const FristVelger: FC<{
    oppgave: IOppgave;
    settFrist: (frist: string | undefined) => void;
    erLesevisning: boolean;
}> = ({ oppgave, settFrist, erLesevisning }) => {
    const { datepickerProps, inputProps } = useDatepicker({
        defaultSelected: nullableTilDato(oppgave.fristFerdigstillelse),
        onDateChange: (dato) => settFrist(dato && tilLocaleDateString(dato)),
    });

    const dagensDato = new Date();

    return (
        <DatePicker {...datepickerProps} fromDate={dagensDato}>
            <DatePicker.Input
                label={'Frist'}
                {...inputProps}
                size={'small'}
                readOnly={erLesevisning}
            />
        </DatePicker>
    );
};
