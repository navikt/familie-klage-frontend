import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render } from '../../../../../../lib/testrender';
import { MottakerRolle } from '../../../mottakerRolle';
import type { BrevmottakerOrganisasjonFormValues } from './BrevmottakerOrganisasjonForm';
import {
    BrevmottakerOrganisasjonFeltnavn,
    BrevmottakerOrganisasjonForm,
} from './BrevmottakerOrganisasjonForm';

const { hentOrganisasjon } = vi.hoisted(() => ({ hentOrganisasjon: vi.fn() }));

vi.mock('../../../../../../App/context/BehandlingContext', () => ({
    useBehandling: () => ({ behandlingErRedigerbar: true }),
}));

vi.mock('../../hooks/useHentOrganisasjon', () => ({
    useHentOrganisasjon: () => hentOrganisasjon,
}));

const GYLDIG_ORGANISASJONSNUMMER = '310287849';
const FEILMELDING = 'Organisasjonen må søkes opp før den kan legges til.';

function TestForm({ onSubmit }: { onSubmit: SubmitHandler<BrevmottakerOrganisasjonFormValues> }) {
    const form = useForm<BrevmottakerOrganisasjonFormValues>({
        defaultValues: {
            [BrevmottakerOrganisasjonFeltnavn.MOTTAKERROLLE]: '',
            [BrevmottakerOrganisasjonFeltnavn.ORGANISASJONSNUMMER]: '',
            [BrevmottakerOrganisasjonFeltnavn.ORGANISASJONSNAVN]: '',
            [BrevmottakerOrganisasjonFeltnavn.NAVN_HOS_ORGANISASJON]: '',
        },
    });
    return <BrevmottakerOrganisasjonForm form={form} onSubmit={onSubmit} onCancel={vi.fn()} />;
}

describe('BrevmottakerOrganisasjonForm', () => {
    beforeEach(() => {
        hentOrganisasjon.mockReset();
        hentOrganisasjon.mockResolvedValue({
            navn: 'Testorganisasjon AS',
            organisasjonsnummer: GYLDIG_ORGANISASJONSNUMMER,
        });
    });

    test('skal vise feilmelding og ikke sende inn hvis organisasjonen ikke er søkt opp', async () => {
        const onSubmit = vi.fn();
        const { screen, user } = render(<TestForm onSubmit={onSubmit} />);

        const organisasjonsnummer = screen.getByRole('searchbox', { name: 'Organisasjonsnummer' });
        await user.type(organisasjonsnummer, GYLDIG_ORGANISASJONSNUMMER);
        await user.click(screen.getByRole('button', { name: 'Legg til brevmottaker' }));

        expect(screen.getByText(FEILMELDING)).toBeInTheDocument();
        expect(organisasjonsnummer).toHaveFocus();
        expect(onSubmit).not.toHaveBeenCalled();
    });

    test('skal fjerne feilmeldingen når organisasjonen blir søkt opp', async () => {
        const { screen, user } = render(<TestForm onSubmit={vi.fn()} />);

        await user.type(
            screen.getByRole('searchbox', { name: 'Organisasjonsnummer' }),
            GYLDIG_ORGANISASJONSNUMMER
        );
        await user.click(screen.getByRole('button', { name: 'Legg til brevmottaker' }));
        expect(screen.getByText(FEILMELDING)).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Søk' }));

        expect(await screen.findByText('Testorganisasjon AS')).toBeInTheDocument();
        expect(screen.queryByText(FEILMELDING)).not.toBeInTheDocument();
    });

    test('skal sende inn skjemaet når organisasjonen er søkt opp og resten er fylt ut', async () => {
        const onSubmit = vi.fn();
        const { screen, user } = render(<TestForm onSubmit={onSubmit} />);

        await user.type(
            screen.getByRole('searchbox', { name: 'Organisasjonsnummer' }),
            GYLDIG_ORGANISASJONSNUMMER
        );
        await user.click(screen.getByRole('button', { name: 'Søk' }));
        expect(await screen.findByText('Testorganisasjon AS')).toBeInTheDocument();
        await user.selectOptions(
            screen.getByRole('combobox', { name: 'Mottakerrolle' }),
            MottakerRolle.FULLMAKT
        );
        await user.type(
            screen.getByRole('textbox', { name: 'Navn på kontaktperson hos organisasjonen' }),
            'Kari Nordmann'
        );
        await user.click(screen.getByRole('button', { name: 'Legg til brevmottaker' }));

        expect(screen.queryByText(FEILMELDING)).not.toBeInTheDocument();
        expect(onSubmit).toHaveBeenCalledOnce();
        expect(onSubmit.mock.calls[0][0]).toEqual({
            [BrevmottakerOrganisasjonFeltnavn.MOTTAKERROLLE]: MottakerRolle.FULLMAKT,
            [BrevmottakerOrganisasjonFeltnavn.ORGANISASJONSNUMMER]: GYLDIG_ORGANISASJONSNUMMER,
            [BrevmottakerOrganisasjonFeltnavn.ORGANISASJONSNAVN]: 'Testorganisasjon AS',
            [BrevmottakerOrganisasjonFeltnavn.NAVN_HOS_ORGANISASJON]: 'Kari Nordmann',
        });
    });
});
