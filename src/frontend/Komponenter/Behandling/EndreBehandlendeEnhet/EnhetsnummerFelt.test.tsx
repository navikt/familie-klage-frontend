import React from 'react';

import { describe, expect, test } from 'vitest';
import { DefaultValues, FormProvider, FormState, useForm } from 'react-hook-form';
import { EndreBehandlendeEnhetFeltnavn } from './feltnavn';
import { EndreBehandlendeEnhetFormValues } from './EndreBehandlendeEnhetModal';
import { render } from '../../../lib/testrender';
import { EnhetsnummerFelt } from './EnhetsnummerFelt';
import { Fagsystem } from '../../../App/typer/fagsak';
import { lagBehandling } from '../../../testdata/behandlingTestdata';

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

describe('EnhetsnummerFelt', () => {
    const fagsystem = Fagsystem.BA;
    const behandlendeEnhet = '4833';
    const comboboxName = 'Velg ny enhet';

    test('skal kunne endre enhet hvis komponenten ikke er i lesevisning', async () => {
        const { screen, user } = render(
            <EnhetsnummerFelt
                behandling={lagBehandling({ fagsystem, behandlendeEnhet })}
                lesevisning={false}
            />,
            { wrapper: FormWrapper }
        );

        const combobox = screen.getByRole('combobox', { name: comboboxName });
        const option = screen.getByRole('option', {
            name: '4817 NAV Familie- og pensjonsytelser Steinkjer',
        });
        await user.selectOptions(combobox, option);
        await user.tab();

        expect(combobox).toBeInTheDocument();
        expect(combobox).not.toHaveAttribute('readonly');
        expect(combobox).toHaveValue('4817');
    });

    test('skal vise komponenten i lesevisningmodus', async () => {
        const { screen } = render(
            <EnhetsnummerFelt
                behandling={lagBehandling({ fagsystem, behandlendeEnhet })}
                lesevisning={true}
            />,
            { wrapper: FormWrapper }
        );

        const image = screen.getByRole('img', { name: 'Skrivebeskyttet' });
        const combobox = screen.getByRole('combobox', { name: 'Skrivebeskyttet ' + comboboxName });

        expect(image).toBeInTheDocument();
        expect(combobox).toBeInTheDocument();
    });

    test('skal fokusere som forventet på tekstfeltet når brukeren klikker på tekstfeltet for å så tabbe ut', async () => {
        const { screen, user } = render(
            <EnhetsnummerFelt behandling={lagBehandling({ fagsystem, behandlendeEnhet })} />,
            { wrapper: FormWrapper }
        );

        const combobox = screen.getByRole('combobox', { name: comboboxName });
        expect(combobox).not.toHaveFocus();
        await user.click(combobox);
        expect(combobox).toHaveFocus();
        await user.tab();
        expect(combobox).not.toHaveFocus();
    });

    test('skal vise feilmelding hvis man prøver å velge en allerde valgt enhet', async () => {
        const { screen, user } = render(
            <EnhetsnummerFelt
                behandling={lagBehandling({ fagsystem, behandlendeEnhet })}
                lesevisning={false}
            />,
            { wrapper: FormWrapper }
        );

        const combobox = screen.getByRole('combobox', { name: comboboxName });
        const option = screen.getByRole('option', {
            name: '4833 NAV Familie- og pensjonsytelser Oslo 1',
        });
        await user.selectOptions(combobox, option);
        await user.tab();

        const feilmelding = screen.getByText(`Enheten er allerede satt på behandlingen.`);
        expect(feilmelding).toBeInTheDocument();
        expect(combobox).toBeInTheDocument();
        expect(combobox).toHaveValue('4833');
    });

    test('skal vise komponent med utfylt verdi fra form state', async () => {
        const { screen } = render(
            <EnhetsnummerFelt behandling={lagBehandling({ fagsystem, behandlendeEnhet })} />,
            {
                wrapper: (props) => (
                    <FormWrapper
                        {...props}
                        defaultValues={{
                            ...DEFAULT_VALUES,
                            [EndreBehandlendeEnhetFeltnavn.ENHETSNUMMER]: '2103',
                        }}
                    />
                ),
            }
        );

        const combobox = screen.getByRole('combobox', { name: comboboxName });
        expect(combobox).toHaveValue('2103');
    });

    test('skal være lesevisning hvis formet blir submitted', async () => {
        const { screen } = render(
            <EnhetsnummerFelt behandling={lagBehandling({ fagsystem, behandlendeEnhet })} />,
            { wrapper: (props) => <FormWrapper {...props} formState={{ isSubmitting: true }} /> }
        );

        const image = screen.getByRole('img', { name: 'Skrivebeskyttet' });
        const combobox = screen.getByRole('combobox', { name: 'Skrivebeskyttet ' + comboboxName });

        expect(image).toBeInTheDocument();
        expect(combobox).toBeInTheDocument();
    });
});
