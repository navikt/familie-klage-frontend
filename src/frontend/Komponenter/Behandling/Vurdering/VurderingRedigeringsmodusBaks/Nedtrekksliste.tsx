import * as React from 'react';
import { FC } from 'react';
import { Box, Heading, Select } from '@navikt/ds-react';
import { Controller, useFormContext } from 'react-hook-form';
import { useApp } from '../../../../App/context/AppContext';
import { VurderingNedtrekkslisteFelter } from './felttyper';

interface NedtrekkslisteProps {
    visningsnavn: string;
    feltnavn: keyof VurderingNedtrekkslisteFelter;
    alternativer: Record<string, string>;
}

export const Nedtrekksliste: FC<NedtrekkslisteProps> = ({
    visningsnavn,
    feltnavn,
    alternativer,
}) => {
    const { control, formState } = useFormContext();
    const { settIkkePersistertKomponent } = useApp();
    return (
        <Box maxWidth="18rem">
            <Heading spacing size="medium" level="2">
                {visningsnavn}
            </Heading>
            <Controller
                name={feltnavn}
                control={control}
                rules={{ required: `${visningsnavn} er påkrevd.` }}
                render={({ field, fieldState }) => {
                    const visFeilmelding = fieldState.isTouched || formState.isSubmitted;
                    return (
                        <Select
                            id={feltnavn}
                            label={visningsnavn}
                            hideLabel
                            size="medium"
                            value={field.value}
                            onBlur={field.onBlur}
                            onChange={({ target: { name, value } }) => {
                                settIkkePersistertKomponent(name);
                                field.onChange(value);
                            }}
                            error={visFeilmelding && fieldState.error?.message}
                            readOnly={formState.isSubmitting}
                        >
                            <option value={''}>Velg</option>
                            {Object.entries(alternativer).map(([nøkkel, verdi]) => (
                                <option value={nøkkel} key={nøkkel}>
                                    {verdi}
                                </option>
                            ))}
                        </Select>
                    );
                }}
            />
        </Box>
    );
};
