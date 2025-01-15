import React from 'react';

import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdresselinjeFelt } from './AdresselinjeFelt';
import { BrevmottakerFeltnavn } from './felttyper';
import { DefaultValues, FormProvider, useForm } from 'react-hook-form';
import { BrevmottakerFormValues } from '../BrevmottakerForm';
import { EøsLandkode } from '../../../../../../../Felles/Landvelger/landkode';
// import '@testing-library/jest-dom/vitest'; <--- Dette fungere, men ønsker egentlig ikke å gjøre det

const defaultValues: DefaultValues<BrevmottakerFormValues> = {
    [BrevmottakerFeltnavn.MOTTAKERTYPE]: '',
    [BrevmottakerFeltnavn.LANDKODE]: EøsLandkode.NO,
    [BrevmottakerFeltnavn.NAVN]: '',
    [BrevmottakerFeltnavn.ADRESSELINJE1]: '',
    [BrevmottakerFeltnavn.ADRESSELINJE2]: '',
    [BrevmottakerFeltnavn.POSTNUMMER]: '',
    [BrevmottakerFeltnavn.POSTSTED]: '',
};

function Wrapper({ children }: { children: React.ReactNode }) {
    const form = useForm<BrevmottakerFormValues>({ mode: 'onChange', defaultValues });
    return <FormProvider {...form}>{children}</FormProvider>;
}

describe('mytest', () => {
    test('skal rendre komponenten når det ikke er lesevisning', () => {
        render(
            <Wrapper>
                <AdresselinjeFelt
                    feltnavn={BrevmottakerFeltnavn.ADRESSELINJE2}
                    visningsnavn={'visningsnavn'}
                />
            </Wrapper>
        );
        const textbox = screen.getByRole('textbox', { name: 'visningsnavn' });
        console.log(textbox);
        console.log(screen.debug());
        expect(0).toBe(0);
        expect(textbox).toBeInTheDocument();
    });
});
