import React from 'react';

import { describe, expect, test } from 'vitest';
import { DefaultValues, FormProvider, FormState, useForm } from 'react-hook-form';
import { EndreBehandlendeEnhetFeltnavn } from './feltnavn';
import { EndreBehandlendeEnhetFormValues } from './EndreBehandlendeEnhetModal';
import { BegrunnelseFelt } from './BegrunnelseFelt';
import { render } from '../../../lib/testrender';

const DEFAULT_VALUES: DefaultValues<EndreBehandlendeEnhetFormValues> = {
    [EndreBehandlendeEnhetFeltnavn.BEGRUNNELSE]: '',
};

function FormWrapper({
    children,
    defaultValues = DEFAULT_VALUES,
    formState = undefined,
}: {
    children: React.ReactNode;
    defaultValues?: DefaultValues<EndreBehandlendeEnhetFormValues>;
    formState?: Partial<FormState<EndreBehandlendeEnhetFormValues>>;
}) {
    const form = useForm<EndreBehandlendeEnhetFormValues>({ mode: 'onChange', defaultValues });
    return (
        <FormProvider {...form} formState={{ ...form.formState, ...(formState ?? {}) }}>
            <form>{children}</form>
        </FormProvider>
    );
}

describe('BegrunnelseFelt', () => {
    const name = 'Begrunnelse';

    test('skal kunne skrive hvis komponenten ikke er i lesevisning', async () => {
        const { screen, user } = render(<BegrunnelseFelt lesevisning={false} />, {
            wrapper: FormWrapper,
        });

        const textbox = screen.getByRole('textbox', { name });
        await user.click(textbox);
        await user.keyboard('Dette er en prøve');

        expect(textbox).toBeInTheDocument();
        expect(textbox).not.toHaveAttribute('readonly');
        expect(textbox).toHaveValue('Dette er en prøve');
    });

    test('skal ikke kunne skrive hvis komponenten er i lesevisning', async () => {
        const { screen, user } = render(<BegrunnelseFelt lesevisning={true} />, {
            wrapper: FormWrapper,
        });

        const textbox = screen.getByRole('textbox', { name });
        await user.click(textbox);
        await user.keyboard('Dette er en prøve');

        expect(textbox).toHaveValue('');
        expect(textbox).toBeInTheDocument();
        expect(textbox).toHaveAttribute('readonly');
    });

    test('skal fokusere som forventet på tekstfeltet når brukeren klikker på tekstfeltet for å så tabbe ut', async () => {
        const { screen, user } = render(<BegrunnelseFelt />, { wrapper: FormWrapper });

        const textbox = screen.getByRole('textbox', { name });
        expect(textbox).not.toHaveFocus();
        await user.click(textbox);
        expect(textbox).toHaveFocus();
        await user.tab();
        expect(textbox).not.toHaveFocus();
    });

    test('skal vise "påkrevd" feilmelding hvis feltet er tomt', async () => {
        const { screen, user } = render(<BegrunnelseFelt />, { wrapper: FormWrapper });

        const textbox = screen.getByRole('textbox', { name });
        await user.click(textbox);
        await user.keyboard('Abc');
        await user.clear(textbox);
        await user.tab();

        const feilmelding = screen.getByText(`Begrunnelse er påkrevd.`);
        expect(feilmelding).toBeInTheDocument();
    });

    test('skal vise maks lengde feilmelding hvis feltet overstiger X antall tegn', async () => {
        const maksAntallTegn = 40;

        const { screen, user } = render(<BegrunnelseFelt maksLengde={maksAntallTegn} />, {
            wrapper: FormWrapper,
        });

        const langTekststreng = 'x'.repeat(maksAntallTegn + 1);

        const textbox = screen.getByRole('textbox', { name });
        await user.click(textbox);
        await user.keyboard(langTekststreng);
        await user.tab();

        const feilmelding = screen.getByText(
            `Begrunnelse kan ikke overstige ${maksAntallTegn} tegn.`
        );
        expect(feilmelding).toBeInTheDocument();
    });

    test('skal ikke vise maks lengde feilmelding hvis feltet inneholder X antall tegn', async () => {
        const maksAntallTegn = 40;

        const { screen, user } = render(<BegrunnelseFelt maksLengde={maksAntallTegn} />, {
            wrapper: FormWrapper,
        });

        const langTekststreng = 'x'.repeat(maksAntallTegn);

        const textbox = screen.getByRole('textbox', { name });
        await user.click(textbox);
        await user.keyboard(langTekststreng);
        await user.tab();

        const feilmelding = screen.queryByText(
            `Begrunnelse kan ikke overstige ${maksAntallTegn} tegn.`
        );
        expect(feilmelding).not.toBeInTheDocument();
    });

    test('skal vise komponent med utfylt verdi fra form state', async () => {
        const { screen } = render(<BegrunnelseFelt />, {
            wrapper: (props) => (
                <FormWrapper
                    {...props}
                    defaultValues={{
                        ...DEFAULT_VALUES,
                        [EndreBehandlendeEnhetFeltnavn.BEGRUNNELSE]: 'bla bla bla',
                    }}
                />
            ),
        });

        const textbox = screen.getByRole('textbox', { name });
        expect(textbox).toHaveValue('bla bla bla');
    });

    test('skal ikke kunne skrive hvis formet blir submitted', async () => {
        const { screen, user } = render(<BegrunnelseFelt />, {
            wrapper: (props) => <FormWrapper {...props} formState={{ isSubmitting: true }} />,
        });

        const textbox = screen.getByRole('textbox', { name });
        await user.click(textbox);
        await user.keyboard('Dette er en prøve');

        expect(textbox).toHaveValue('');
        expect(textbox).toBeInTheDocument();
        expect(textbox).toHaveAttribute('readonly');
    });
});
