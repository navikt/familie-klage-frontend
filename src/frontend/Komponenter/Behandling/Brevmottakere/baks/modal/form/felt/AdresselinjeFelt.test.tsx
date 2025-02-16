import React from 'react';

import { describe, expect, test } from 'vitest';
import { AdresselinjeFelt } from './AdresselinjeFelt';
import { BrevmottakerFeltnavn } from './felttyper';
import { DefaultValues, FormProvider, FormState, useForm } from 'react-hook-form';
import { BrevmottakerFormValues } from '../BrevmottakerForm';
import { render } from '../../../../../../../lib/testrender';

const DEFAULT_VALUES: DefaultValues<BrevmottakerFormValues> = {
    [BrevmottakerFeltnavn.ADRESSELINJE1]: '',
};

function FormWrapper({
    children,
    defaultValues = DEFAULT_VALUES,
    formState = undefined,
}: {
    children: React.ReactNode;
    defaultValues?: DefaultValues<BrevmottakerFormValues>;
    formState?: Partial<FormState<BrevmottakerFormValues>>;
}) {
    const form = useForm<BrevmottakerFormValues>({ mode: 'onChange', defaultValues });
    return (
        <FormProvider {...form} formState={{ ...form.formState, ...formState }}>
            {children}
        </FormProvider>
    );
}

const visningsnavn = 'Adresselinje 1';

describe('AdresselinjeFelt', () => {
    test('skal kunne skrive hvis komponenten ikke er i lesevisning', async () => {
        const { screen, user } = render(
            <AdresselinjeFelt
                feltnavn={BrevmottakerFeltnavn.ADRESSELINJE1}
                visningsnavn={visningsnavn}
                erLesevisning={false}
            />,
            { wrapper: FormWrapper }
        );

        const textbox = screen.getByRole('textbox', { name: visningsnavn });
        await user.click(textbox);
        await user.keyboard('Dette er en prøve');

        expect(textbox).toBeInTheDocument();
        expect(textbox).not.toHaveAttribute('readonly');
        expect(textbox).toHaveValue('Dette er en prøve');
    });

    test('skal ikke kunne skrive hvis komponenten er i lesevisning', async () => {
        const { screen, user } = render(
            <AdresselinjeFelt
                feltnavn={BrevmottakerFeltnavn.ADRESSELINJE1}
                visningsnavn={visningsnavn}
                erLesevisning={true}
            />,
            { wrapper: FormWrapper }
        );

        const textbox = screen.getByRole('textbox', { name: visningsnavn });
        await user.click(textbox);
        await user.keyboard('Dette er en prøve');

        expect(textbox).toHaveValue('');
        expect(textbox).toBeInTheDocument();
        expect(textbox).toHaveAttribute('readonly');
    });

    test('skal fokusere som forventet på tekstfeltet når brukeren klikker på tekstfeltet for å så tabbe ut', async () => {
        const { screen, user } = render(
            <AdresselinjeFelt
                feltnavn={BrevmottakerFeltnavn.ADRESSELINJE1}
                visningsnavn={visningsnavn}
            />,
            { wrapper: FormWrapper }
        );

        const textbox = screen.getByRole('textbox', { name: visningsnavn });
        expect(textbox).not.toHaveFocus();
        await user.click(textbox);
        expect(textbox).toHaveFocus();
        await user.tab();
        expect(textbox).not.toHaveFocus();
    });

    test('skal vise "påkrevd" feilmelding hvis feltet ikke er valgfri og feltet er tomt', async () => {
        const { screen, user } = render(
            <AdresselinjeFelt
                feltnavn={BrevmottakerFeltnavn.ADRESSELINJE1}
                visningsnavn={visningsnavn}
                valgfri={false}
            />,
            { wrapper: FormWrapper }
        );

        const textbox = screen.getByRole('textbox', { name: visningsnavn });
        await user.click(textbox);
        await user.keyboard('Abc');
        await user.clear(textbox);
        await user.tab();

        const feilmelding = screen.getByText(`${visningsnavn} er påkrevd.`);
        expect(feilmelding).toBeInTheDocument();
    });

    test('skal ikke vise "påkrevd" feilmelding hvis feltet er valgfri og feltet er tomt', async () => {
        const { screen, user } = render(
            <AdresselinjeFelt
                feltnavn={BrevmottakerFeltnavn.ADRESSELINJE1}
                visningsnavn={visningsnavn}
                valgfri={true}
            />,
            { wrapper: FormWrapper }
        );

        const textbox = screen.getByRole('textbox', { name: visningsnavn });
        await user.click(textbox);
        await user.keyboard('Abc');
        await user.clear(textbox);
        await user.tab();

        const feilmelding = screen.queryByText(`${visningsnavn} er påkrevd.`);
        expect(feilmelding).not.toBeInTheDocument();
    });

    test('skal vise maks lengde feilmelding hvis feltet overstiger 80 tegn', async () => {
        const { screen, user } = render(
            <AdresselinjeFelt
                feltnavn={BrevmottakerFeltnavn.ADRESSELINJE1}
                visningsnavn={visningsnavn}
            />,
            { wrapper: FormWrapper }
        );

        const textbox = screen.getByRole('textbox', { name: visningsnavn });
        await user.click(textbox);
        await user.keyboard(
            'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligulade'
        );
        await user.tab();

        const feilmelding = screen.getByText(`${visningsnavn} kan ikke inneholde mer enn 80 tegn.`);
        expect(feilmelding).toBeInTheDocument();
    });

    test('skal ikke vise maks lengde feilmelding hvis feltet inneholder 80 tegn', async () => {
        const { screen, user } = render(
            <AdresselinjeFelt
                feltnavn={BrevmottakerFeltnavn.ADRESSELINJE1}
                visningsnavn={visningsnavn}
            />,
            { wrapper: FormWrapper }
        );

        const textbox = screen.getByRole('textbox', { name: visningsnavn });
        await user.click(textbox);
        await user.keyboard(
            'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligulaa'
        );
        await user.tab();

        const feilmelding = screen.queryByText(
            `${visningsnavn} kan ikke inneholde mer enn 80 tegn.`
        );
        expect(feilmelding).not.toBeInTheDocument();
    });

    test('skal vise komponent med utfylt verdi fra form state', async () => {
        const { screen } = render(
            <AdresselinjeFelt
                feltnavn={BrevmottakerFeltnavn.ADRESSELINJE1}
                visningsnavn={visningsnavn}
            />,
            {
                wrapper: (props) => (
                    <FormWrapper
                        {...props}
                        defaultValues={{
                            ...DEFAULT_VALUES,
                            [BrevmottakerFeltnavn.ADRESSELINJE1]: 'Osloveien 1337',
                        }}
                    />
                ),
            }
        );

        const textbox = screen.getByRole('textbox', { name: visningsnavn });
        expect(textbox).toHaveValue('Osloveien 1337');
    });

    test('skal ikke kunne skrive hvis formet blir submitted', async () => {
        const { screen, user } = render(
            <AdresselinjeFelt
                feltnavn={BrevmottakerFeltnavn.ADRESSELINJE1}
                visningsnavn={visningsnavn}
            />,
            {
                wrapper: (props) => <FormWrapper {...props} formState={{ isSubmitting: true }} />,
            }
        );

        const textbox = screen.getByRole('textbox', { name: visningsnavn });
        await user.click(textbox);
        await user.keyboard('Dette er en prøve');

        expect(textbox).toHaveValue('');
        expect(textbox).toBeInTheDocument();
        expect(textbox).toHaveAttribute('readonly');
    });
});
