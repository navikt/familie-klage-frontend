import { Modal } from '@navikt/ds-react';
import React from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ToggleName } from '../../../../../App/context/toggles';
import { render } from '../../../../../lib/testrender';
import type { Brevmottakere } from '../../brevmottakere';
import { MottakerRolle } from '../../mottakerRolle';
import { BrevmottakerModalBody } from './BrevmottakerModalBody';

const { hentOrganisasjon } = vi.hoisted(() => ({
    hentOrganisasjon: vi.fn(),
}));

vi.mock('../../../../../App/context/BehandlingContext', () => ({
    useBehandling: () => ({ behandlingErRedigerbar: true }),
}));

vi.mock('../../../../../App/context/PersonopplysningerContext', () => ({
    usePersonopplysningerContext: () => ({ fagsakEier: { navn: 'Ola Nordmann' } }),
}));

vi.mock('../../../../../App/context/TogglesContext', () => ({
    useToggles: () => ({
        toggles: { [ToggleName.MANUELL_BREVMOTTAKER_ORGANISASJON]: true },
    }),
}));

vi.mock('../hooks/useHentOrganisasjon', () => ({
    useHentOrganisasjon: () => hentOrganisasjon,
}));

const GYLDIG_ORGANISASJONSNUMMER = '889640782';

const INGEN_BREVMOTTAKERE: Brevmottakere = { personer: [], organisasjoner: [] };

describe('BrevmottakerModalBody', () => {
    beforeEach(() => {
        hentOrganisasjon.mockReset();
        hentOrganisasjon.mockResolvedValue({
            navn: 'Organisasjon AS',
            organisasjonsnummer: GYLDIG_ORGANISASJONSNUMMER,
        });
    });

    test('skal vise feilmeldingen fra backend i organisasjonsskjemaet når oppretting feiler', async () => {
        const opprettBrevmottaker = vi.fn(() =>
            Promise.reject(new Error('Organisasjonsnavn kan ikke være tomt.'))
        );
        const { screen, user } = render(
            <Modal open={true} onClose={vi.fn()} aria-label={'Brevmottakere'}>
                <BrevmottakerModalBody
                    brevmottakere={INGEN_BREVMOTTAKERE}
                    opprettBrevmottaker={opprettBrevmottaker}
                    slettBrevmottaker={vi.fn()}
                />
            </Modal>
        );

        await user.click(screen.getByRole('radio', { name: 'Organisasjon' }));
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

        expect(opprettBrevmottaker).toHaveBeenCalledOnce();
        expect(
            await screen.findByText('Organisasjonsnavn kan ikke være tomt.')
        ).toBeInTheDocument();
        expect(screen.getByRole('searchbox', { name: 'Organisasjonsnummer' })).toHaveValue(
            GYLDIG_ORGANISASJONSNUMMER
        );
    });
});
