import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Fagsystem } from '../../App/typer/fagsak';
import { RessursStatus } from '../../App/typer/ressurs';
import { Stønadstype } from '../../App/typer/stønadstype';
import { render } from '../../lib/testrender';
import { TestSide } from './TestSide';

const axiosRequest = vi.fn();
const navigate = vi.fn();

vi.mock('../../App/context/AppContext', () => ({
    useApp: () => ({ axiosRequest }),
}));

vi.mock('react-router-dom', () => ({
    useNavigate: () => navigate,
}));

describe('TestSide', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const knappNavn = 'Lag behandling';

    test('skal ikke kunne opprette behandling før ident, fagsystem og stønadstype er valgt', async () => {
        const { screen, user } = render(<TestSide />);

        expect(screen.getByRole('button', { name: knappNavn })).toBeDisabled();

        await user.type(screen.getByRole('textbox', { name: 'Ident' }), '12345678910');
        expect(screen.getByRole('button', { name: knappNavn })).toBeDisabled();

        await user.selectOptions(screen.getByRole('combobox', { name: 'Fagsystem' }), Fagsystem.BA);
        expect(screen.getByRole('button', { name: knappNavn })).toBeDisabled();

        await user.selectOptions(screen.getByRole('combobox', { name: /Stønadstype/ }), Stønadstype.BARNETRYGD);
        expect(screen.getByRole('button', { name: knappNavn })).toBeEnabled();
    });

    test('skal kun tilby stønadstyper som hører til valgt fagsystem', async () => {
        const { screen, user } = render(<TestSide />);

        const stønadstypeVelger = screen.getByRole('combobox', { name: /Stønadstype/ });
        expect(stønadstypeVelger).toBeDisabled();

        await user.selectOptions(screen.getByRole('combobox', { name: 'Fagsystem' }), Fagsystem.KS);

        expect(stønadstypeVelger).toBeEnabled();
        expect(screen.getByRole('option', { name: 'Kontantstøtte' })).toBeInTheDocument();
        expect(screen.queryByRole('option', { name: 'Overgangsstønad' })).not.toBeInTheDocument();
        expect(screen.queryByRole('option', { name: 'Barnetrygd' })).not.toBeInTheDocument();
    });

    test('skal nullstille valgt stønadstype når fagsystemet endres', async () => {
        const { screen, user } = render(<TestSide />);

        const fagsystemVelger = screen.getByRole('combobox', { name: 'Fagsystem' });
        const stønadstypeVelger = screen.getByRole('combobox', { name: /Stønadstype/ });

        await user.selectOptions(fagsystemVelger, Fagsystem.BA);
        await user.selectOptions(stønadstypeVelger, Stønadstype.BARNETRYGD);
        expect(stønadstypeVelger).toHaveValue(Stønadstype.BARNETRYGD);

        await user.selectOptions(fagsystemVelger, Fagsystem.KS);
        expect(stønadstypeVelger).toHaveValue('');
    });

    test('skal sende med behandlende enhet og navigere til formkrav når behandlingen er opprettet', async () => {
        axiosRequest.mockResolvedValue({
            status: RessursStatus.SUKSESS,
            data: 'en-behandling-id',
        });

        const { screen, user } = render(<TestSide />);

        await user.type(screen.getByRole('textbox', { name: 'Ident' }), '12345678910');
        await user.selectOptions(screen.getByRole('combobox', { name: 'Fagsystem' }), Fagsystem.BA);
        await user.selectOptions(screen.getByRole('combobox', { name: /Stønadstype/ }), Stønadstype.BARNETRYGD);
        await user.click(screen.getByRole('button', { name: knappNavn }));

        expect(axiosRequest).toHaveBeenCalledWith({
            method: 'POST',
            url: '/familie-klage/api/test/opprett',
            data: {
                ident: '12345678910',
                stønadstype: Stønadstype.BARNETRYGD,
                fagsystem: Fagsystem.BA,
                behandlendeEnhet: '4806',
            },
        });
        expect(navigate).toHaveBeenCalledWith('/behandling/en-behandling-id/formkrav');
    });

    test('skal bruke fallback-enhet for fagsystem uten arbeidsfordelingsenheter', async () => {
        axiosRequest.mockResolvedValue({
            status: RessursStatus.SUKSESS,
            data: 'en-behandling-id',
        });

        const { screen, user } = render(<TestSide />);

        await user.type(screen.getByRole('textbox', { name: 'Ident' }), '12345678910');
        await user.selectOptions(screen.getByRole('combobox', { name: 'Fagsystem' }), Fagsystem.EF);
        await user.selectOptions(screen.getByRole('combobox', { name: /Stønadstype/ }), Stønadstype.OVERGANGSSTØNAD);
        await user.click(screen.getByRole('button', { name: knappNavn }));

        expect(axiosRequest).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({ behandlendeEnhet: '4489' }),
            })
        );
    });

    test('skal vise feilmelding og ikke navigere når opprettelsen feiler', async () => {
        axiosRequest.mockResolvedValue({
            status: RessursStatus.FEILET,
            frontendFeilmelding: 'Noe gikk galt',
        });

        const { screen, user } = render(<TestSide />);

        await user.type(screen.getByRole('textbox', { name: 'Ident' }), '12345678910');
        await user.selectOptions(screen.getByRole('combobox', { name: 'Fagsystem' }), Fagsystem.BA);
        await user.selectOptions(screen.getByRole('combobox', { name: /Stønadstype/ }), Stønadstype.BARNETRYGD);
        await user.click(screen.getByRole('button', { name: knappNavn }));

        expect(await screen.findByText('Noe gikk galt')).toBeInTheDocument();
        expect(navigate).not.toHaveBeenCalled();
    });
});
