import React, { FC } from 'react';
import { useDatepicker, DatePicker, Label, BodyShort } from '@navikt/ds-react';
import { nullableTilDato, tilLocaleDateString } from '../../../App/utils/dato';
import { formaterNullableIsoDato } from '../../../App/utils/formatter';
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

    const formatertFristDato = formaterNullableIsoDato(oppgave.fristFerdigstillelse);
    const dagensDato = new Date();

    return (
        <div>
            {erLesevisning ? (
                <div>
                    <Label size="small">Frist</Label>
                    <BodyShort size="small">{formatertFristDato}</BodyShort>
                </div>
            ) : (
                <DatePicker {...datepickerProps} fromDate={dagensDato}>
                    <DatePicker.Input label={'Frist'} {...inputProps} size={'small'} />
                </DatePicker>
            )}
        </div>
    );
};
