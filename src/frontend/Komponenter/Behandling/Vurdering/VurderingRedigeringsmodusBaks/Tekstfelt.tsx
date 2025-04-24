import { Textarea } from '@navikt/ds-react';
import { Controller, useFormContext } from 'react-hook-form';
import React, { FC } from 'react';
import { useApp } from '../../../../App/context/AppContext';
import { VurderingTekstfeltFelter } from './felttyper';

interface TekstfeltProps {
    visningsnavn: string;
    feltnavn: keyof VurderingTekstfeltFelter;
    frivillig?: boolean;
}

export const Tekstfelt: FC<TekstfeltProps> = ({ visningsnavn, feltnavn, frivillig }) => {
    const { control, formState } = useFormContext();
    const { settIkkePersistertKomponent } = useApp();
    return (
        <Controller
            name={feltnavn}
            control={control}
            rules={{ required: !frivillig ? `${visningsnavn} er påkrevd.` : undefined }}
            render={({ field, fieldState }) => {
                const visFeilmelding = fieldState.isTouched || formState.isSubmitted;
                return (
                    <Textarea
                        id={feltnavn}
                        label={visningsnavn}
                        hideLabel
                        size="medium"
                        value={field.value}
                        onBlur={field.onBlur}
                        onChange={({ target: { name, value } }) => {
                            settIkkePersistertKomponent(name);
                            field.onChange(value === '' ? null : value);
                        }}
                        error={visFeilmelding && fieldState.error?.message}
                        readOnly={formState.isSubmitting}
                    />
                );
            }}
        />
    );
};
