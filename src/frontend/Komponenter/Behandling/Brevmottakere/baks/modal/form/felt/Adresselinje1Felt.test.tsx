import React from 'react';

import { describe, expect, test } from 'vitest';
import { Adresselinje1Felt } from './Adresselinje1Felt';
import { DefaultValues, FormProvider, useForm } from 'react-hook-form';
import { BrevmottakerFeltnavn, BrevmottakerFormValues } from '../BrevmottakerForm';
import { render } from '../../../../../../../lib/testrender';
import { Button } from '@navikt/ds-react';

const onSubmit = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

const DEFAULT_VALUES: DefaultValues<BrevmottakerFormValues> = {
    [BrevmottakerFeltnavn.ADRESSELINJE1]: '',
};

function FormWrapper({
    children,
    defaultValues = DEFAULT_VALUES,
    onSubmitDelay = 0,
}: {
    children: React.ReactNode;
    defaultValues?: DefaultValues<BrevmottakerFormValues>;
    onSubmitDelay?: number;
}) {
    const form = useForm<BrevmottakerFormValues>({ mode: 'onChange', defaultValues });
    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(() => onSubmit(onSubmitDelay))}>
                {children}
                <Button type={'submit'}>Submit</Button>
            </form>
        </FormProvider>
    );
}

const visningsnavn = 'Adresselinje 1';

describe('AdresselinjeFelt', () => {
    test('skal kunne skrive hvis komponenten ikke er i lesevisning', async () => {
        const { screen, user } = render(<Adresselinje1Felt erLesevisning={false} />, {
            wrapper: FormWrapper,
        });

        const textbox = screen.getByRole('textbox', { name: visningsnavn });
        await user.click(textbox);
        await user.keyboard('Dette er en prøve');

        expect(textbox).toBeInTheDocument();
        expect(textbox).not.toHaveAttribute('readonly');
        expect(textbox).toHaveValue('Dette er en prøve');
    });

    test('skal ikke kunne skrive hvis komponenten er i lesevisning', async () => {
        const { screen, user } = render(<Adresselinje1Felt erLesevisning={true} />, {
            wrapper: FormWrapper,
        });

        const textbox = screen.getByRole('textbox', { name: visningsnavn });
        await user.click(textbox);
        await user.keyboard('Dette er en prøve');

        expect(textbox).toHaveValue('');
        expect(textbox).toBeInTheDocument();
        expect(textbox).toHaveAttribute('readonly');
    });

    test('skal fokusere som forventet på tekstfeltet når brukeren klikker på tekstfeltet for å så tabbe ut', async () => {
        const { screen, user } = render(<Adresselinje1Felt />, { wrapper: FormWrapper });

        const textbox = screen.getByRole('textbox', { name: visningsnavn });
        expect(textbox).not.toHaveFocus();
        await user.click(textbox);
        expect(textbox).toHaveFocus();
        await user.tab();
        expect(textbox).not.toHaveFocus();
    });

    test('skal vise "påkrevd" feilmelding hvis feltet er tomt', async () => {
        const { screen, user } = render(<Adresselinje1Felt />, { wrapper: FormWrapper });

        const textbox = screen.getByRole('textbox', { name: visningsnavn });
        await user.click(textbox);
        await user.keyboard('Abc');
        await user.clear(textbox);
        await user.tab();

        const feilmelding = screen.getByText(`${visningsnavn} er påkrevd.`);
        expect(feilmelding).toBeInTheDocument();
    });

    test('skal vise maks lengde feilmelding hvis feltet overstiger 80 tegn', async () => {
        const { screen, user } = render(<Adresselinje1Felt />, { wrapper: FormWrapper });

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
        const { screen, user } = render(<Adresselinje1Felt />, { wrapper: FormWrapper });

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
        const { screen } = render(<Adresselinje1Felt />, {
            wrapper: (props) => (
                <FormWrapper
                    {...props}
                    defaultValues={{
                        ...DEFAULT_VALUES,
                        [BrevmottakerFeltnavn.ADRESSELINJE1]: 'Osloveien 1337',
                    }}
                />
            ),
        });

        const textbox = screen.getByRole('textbox', { name: visningsnavn });
        expect(textbox).toHaveValue('Osloveien 1337');
    });

    test('skal ikke kunne skrive hvis formet blir submitted', async () => {
        const { screen, user } = render(<Adresselinje1Felt />, {
            wrapper: (props) => <FormWrapper {...props} onSubmitDelay={3_000} />,
        });

        const textbox = screen.getByRole('textbox', { name: visningsnavn });
        await user.click(textbox);
        await user.keyboard('abc');

        expect(textbox).toHaveValue('abc');
        expect(textbox).toBeInTheDocument();
        expect(textbox).not.toHaveAttribute('readonly');

        const submitButton = screen.getByRole('button', { name: 'Submit' });
        await user.click(submitButton);
        await user.click(textbox);
        await user.keyboard('123');

        expect(textbox).toHaveValue('abc');
        expect(textbox).toBeInTheDocument();
        expect(textbox).toHaveAttribute('readonly');
    });
});
