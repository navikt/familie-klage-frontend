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
    organisasjonIkkeHentetFeilmelding,
} from './BrevmottakerOrganisasjonForm';

const { hentOrganisasjon } = vi.hoisted(() => ({
    hentOrganisasjon: vi.fn(),
}));

vi.mock('../../../../../../App/context/BehandlingContext', () => ({
    useBehandling: () => ({ behandlingErRedigerbar: true }),
}));

vi.mock('../../hooks/useHentOrganisasjon', () => ({
    useHentOrganisasjon: () => hentOrganisasjon,
}));

const GYLDIG_ORGANISASJONSNUMMER = '889640782';

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
            navn: 'Organisasjon AS',
            organisasjonsnummer: GYLDIG_ORGANISASJONSNUMMER,
        });
    });

    test('skal vise feilmelding på organisasjonsnummer og ikke sende inn hvis organisasjonen ikke er søkt opp', async () => {
        const onSubmit = vi.fn(() => Promise.resolve());
        const { screen, user } = render(<TestForm onSubmit={onSubmit} />);

        const organisasjonsnummer = screen.getByRole('searchbox', { name: 'Organisasjonsnummer' });
        await user.click(organisasjonsnummer);
        await user.keyboard(GYLDIG_ORGANISASJONSNUMMER);
        await user.click(screen.getByRole('button', { name: 'Legg til brevmottaker' }));

        expect(screen.getByText(organisasjonIkkeHentetFeilmelding)).toBeInTheDocument();
        expect(organisasjonsnummer).toHaveFocus();
        expect(onSubmit).not.toHaveBeenCalled();
    });

    test('skal fjerne feilmeldingen når organisasjonen blir søkt opp', async () => {
        const onSubmit = vi.fn(() => Promise.resolve());
        const { screen, user } = render(<TestForm onSubmit={onSubmit} />);

        await user.click(screen.getByRole('searchbox', { name: 'Organisasjonsnummer' }));
        await user.keyboard(GYLDIG_ORGANISASJONSNUMMER);
        await user.click(screen.getByRole('button', { name: 'Legg til brevmottaker' }));
        expect(screen.getByText(organisasjonIkkeHentetFeilmelding)).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Søk' }));

        expect(await screen.findByText('Organisasjon AS')).toBeInTheDocument();
        expect(screen.queryByText(organisasjonIkkeHentetFeilmelding)).not.toBeInTheDocument();
    });

    test('skal sende inn skjemaet når organisasjonen er søkt opp og resten av feltene er fylt ut', async () => {
        const onSubmit = vi.fn<(values: BrevmottakerOrganisasjonFormValues) => Promise<void>>(() =>
            Promise.resolve()
        );
        const { screen, user } = render(<TestForm onSubmit={onSubmit} />);

        await user.click(screen.getByRole('searchbox', { name: 'Organisasjonsnummer' }));
        await user.keyboard(GYLDIG_ORGANISASJONSNUMMER);
        await user.click(screen.getByRole('button', { name: 'Søk' }));
        expect(await screen.findByText('Organisasjon AS')).toBeInTheDocument();
        await user.selectOptions(
            screen.getByRole('combobox', { name: 'Mottakerrolle' }),
            MottakerRolle.FULLMAKT
        );
        await user.click(
            screen.getByRole('textbox', { name: 'Navn på kontaktperson hos organisasjonen' })
        );
        await user.keyboard('Kari Nordmann');
        await user.click(screen.getByRole('button', { name: 'Legg til brevmottaker' }));

        expect(screen.queryByText(organisasjonIkkeHentetFeilmelding)).not.toBeInTheDocument();
        expect(onSubmit).toHaveBeenCalledOnce();
        expect(onSubmit.mock.calls[0][0]).toMatchObject({
            [BrevmottakerOrganisasjonFeltnavn.MOTTAKERROLLE]: MottakerRolle.FULLMAKT,
            [BrevmottakerOrganisasjonFeltnavn.ORGANISASJONSNUMMER]: GYLDIG_ORGANISASJONSNUMMER,
            [BrevmottakerOrganisasjonFeltnavn.ORGANISASJONSNAVN]: 'Organisasjon AS',
            [BrevmottakerOrganisasjonFeltnavn.NAVN_HOS_ORGANISASJON]: 'Kari Nordmann',
        });
    });
});
