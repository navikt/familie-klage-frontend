import React from 'react';

import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdresselinjeFelt } from './AdresselinjeFelt';
import { BrevmottakerFeltnavn } from './felttyper';
import { DefaultValues, FormProvider, useForm } from 'react-hook-form';
import { BrevmottakerFormValues } from '../BrevmottakerForm';

const defaultValues: DefaultValues<BrevmottakerFormValues> = {
    [BrevmottakerFeltnavn.ADRESSELINJE1]: '',
};

function Wrapper({ children }: { children: React.ReactNode }) {
    const form = useForm<BrevmottakerFormValues>({ mode: 'onChange', defaultValues });
    return <FormProvider {...form}>{children}</FormProvider>;
}

describe('AdresselinjeFelt', () => {
    test('skal rendre komponenten når det ikke er lesevisning', () => {
        render(
            <Wrapper>
                <AdresselinjeFelt
                    feltnavn={BrevmottakerFeltnavn.ADRESSELINJE1}
                    visningsnavn={'visningsnavn'}
                    erLesevisning={false}
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
