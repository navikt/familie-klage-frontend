import React from 'react';

import { describe, expect, test } from 'vitest';
import { FormProvider, useForm } from 'react-hook-form';
import { EndreBehandlendeEnhetFeltnavn } from './feltnavn';
import { render } from '../../../lib/testrender';
import { EnhetsnummerFelt } from './EnhetsnummerFelt';
import { Fagsystem } from '../../../App/typer/fagsak';
import { BehandlingTestdata } from '../../../testdata/behandlingTestdata';
import { Button } from '@navikt/ds-react';

const onSubmit = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

function FormWrapper({
    children,
    values = { [EndreBehandlendeEnhetFeltnavn.ENHETSNUMMER]: '4833' },
    onSubmitDelay = 0,
}: {
    children: React.ReactNode;
    values?: { [EndreBehandlendeEnhetFeltnavn.ENHETSNUMMER]: string };
    onSubmitDelay?: number;
}) {
    const form = useForm<{ [EndreBehandlendeEnhetFeltnavn.ENHETSNUMMER]: string }>({
        mode: 'onChange',
        values,
    });
    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(() => onSubmit(onSubmitDelay))}>
                {children}
                <Button type={'submit'}>Submit</Button>
            </form>
        </FormProvider>
    );
}

describe('EnhetsnummerFelt', () => {
    const behandling = BehandlingTestdata.lagBehandling({
        fagsystem: Fagsystem.BA,
        behandlendeEnhet: '4833',
    });

    const comboboxName = 'Velg ny enhet';

    test('skal kunne endre enhet hvis komponenten ikke er i lesevisning', async () => {
        const { screen, user } = render(
            <EnhetsnummerFelt behandling={behandling} lesevisning={false} />,
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
        const { screen } = render(<EnhetsnummerFelt behandling={behandling} lesevisning={true} />, {
            wrapper: FormWrapper,
        });

        const image = screen.getByRole('img', { name: 'Skrivebeskyttet' });
        const combobox = screen.getByRole('combobox', { name: 'Skrivebeskyttet' + comboboxName });

        expect(image).toBeInTheDocument();
        expect(combobox).toBeInTheDocument();
    });

    test('skal fokusere som forventet på comboboxen når brukeren klikker på comboboxen for å så tabbe ut', async () => {
        const { screen, user } = render(<EnhetsnummerFelt behandling={behandling} />, {
            wrapper: FormWrapper,
        });

        const combobox = screen.getByRole('combobox', { name: comboboxName });
        expect(combobox).not.toHaveFocus();
        await user.click(combobox);
        expect(combobox).toHaveFocus();
        await user.tab();
        expect(combobox).not.toHaveFocus();
    });

    test('skal vise feilmelding hvis man prøver å velge en allerde valgt enhet', async () => {
        const { screen, user } = render(<EnhetsnummerFelt behandling={behandling} />, {
            wrapper: FormWrapper,
        });

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

    test('skal vise komponent med preutfylt verdi fra values', async () => {
        const { screen } = render(<EnhetsnummerFelt behandling={behandling} />, {
            wrapper: FormWrapper,
        });

        const combobox = screen.getByRole('combobox', { name: comboboxName });
        expect(combobox).toHaveValue('4833');
    });

    test('skal vise lesevisning hvis formet blir submitted', async () => {
        const { user, screen } = render(<EnhetsnummerFelt behandling={behandling} />, {
            wrapper: (props) => <FormWrapper {...props} onSubmitDelay={3_000} />,
        });

        const combobox = screen.getByRole('combobox', { name: comboboxName });
        const option = screen.getByRole('option', {
            name: '4817 NAV Familie- og pensjonsytelser Steinkjer',
        });
        await user.selectOptions(combobox, option);

        expect(screen.queryByRole('img', { name: 'Skrivebeskyttet' })).not.toBeInTheDocument();
        expect(
            screen.queryByRole('combobox', { name: 'Skrivebeskyttet' + comboboxName })
        ).not.toBeInTheDocument();

        const submitButton = screen.getByRole('button', { name: 'Submit' });
        await user.click(submitButton);

        const skrivebeskyttetImage = await screen.findByRole('img', { name: 'Skrivebeskyttet' });
        const skrivebeskyttetCombobox = await screen.findByRole('combobox', {
            name: 'Skrivebeskyttet' + comboboxName,
        });

        expect(skrivebeskyttetImage).toBeInTheDocument();
        expect(skrivebeskyttetCombobox).toBeInTheDocument();
    });
});
