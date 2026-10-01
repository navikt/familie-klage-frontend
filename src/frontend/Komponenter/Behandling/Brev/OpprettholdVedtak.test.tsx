import { beforeEach, describe, expect, test, vi } from 'vitest';
import { BehandlingStatus } from '../../../App/typer/behandlingstatus';
import type { Behandling } from '../../../App/typer/fagsak';
import { BehandlingResultat, Fagsystem, StegType } from '../../../App/typer/fagsak';
import { RessursStatus } from '../../../App/typer/ressurs';
import { render } from '../../../lib/testrender';
import { lagBehandling } from '../../../testdata/behandlingTestdata';
import { OpprettholdVedtak } from './OpprettholdVedtak';

const { axiosRequest, useBehandling } = vi.hoisted(() => ({
    axiosRequest: vi.fn(),
    useBehandling: vi.fn(),
}));

vi.mock('../../../App/context/AppContext', () => ({
    useApp: () => ({ axiosRequest }),
}));

vi.mock('../../../App/context/BehandlingContext', () => ({
    useBehandling,
}));

vi.mock('./useFerdigstillBehandling', () => ({
    useFerdigstillBehandling: () => ({ ferdigstill: vi.fn(), senderInn: false }),
}));

vi.mock('./PdfVisning', () => ({
    PdfVisning: () => null,
}));

vi.mock('../Brevmottakere/baks/BrevmottakerContainer', () => ({
    BrevmottakerContainer: () => <div>Brevmottakere</div>,
}));

const BEHANDLING_ID = 'behandling-id';
const PDF_URL = `/familie-klage/api/brev/${BEHANDLING_ID}/pdf`;
const GENERER_URL = `/familie-klage/api/brev/${BEHANDLING_ID}`;

function mockBehandling(behandling: Behandling, behandlingErRedigerbar: boolean) {
    useBehandling.mockReturnValue({
        behandling: { status: RessursStatus.SUKSESS, data: behandling },
        behandlingErRedigerbar,
    });
}

describe('OpprettholdVedtak', () => {
    beforeEach(() => {
        axiosRequest.mockReset();
        axiosRequest.mockReturnValue(new Promise(() => {}));
    });

    test('skal generere brev når behandlingen er redigerbar', () => {
        // Arrange
        mockBehandling(lagBehandling({ steg: StegType.BREV, status: BehandlingStatus.UTREDES }), true);

        // Act
        render(<OpprettholdVedtak behandlingId={BEHANDLING_ID} fagsystem={Fagsystem.BA} />);

        // Assert
        expect(axiosRequest).toHaveBeenCalledTimes(1);
        expect(axiosRequest).toHaveBeenCalledWith({ method: 'POST', url: GENERER_URL });
    });

    test('skal hente lagret pdf når behandlingen er forbi brev-steget', () => {
        // Arrange
        mockBehandling(
            lagBehandling({
                steg: StegType.KABAL_VENTER_SVAR,
                status: BehandlingStatus.VENTER,
                resultat: BehandlingResultat.IKKE_MEDHOLD,
            }),
            false
        );

        // Act
        render(<OpprettholdVedtak behandlingId={BEHANDLING_ID} fagsystem={Fagsystem.BA} />);

        // Assert
        expect(axiosRequest).toHaveBeenCalledTimes(1);
        expect(axiosRequest).toHaveBeenCalledWith({ method: 'GET', url: PDF_URL });
    });

    test('skal vise melding og ikke kalle backend når behandlingen er satt på vent i brev-steget', () => {
        // Arrange
        mockBehandling(lagBehandling({ steg: StegType.BREV, status: BehandlingStatus.SATT_PÅ_VENT }), false);

        // Act
        const { screen } = render(<OpprettholdVedtak behandlingId={BEHANDLING_ID} fagsystem={Fagsystem.BA} />);

        // Assert
        expect(screen.getByText('Brevet kan vises når behandlingen tas av vent.')).toBeInTheDocument();
        expect(axiosRequest).not.toHaveBeenCalled();
    });

    test('skal vise melding og ikke hente pdf når behandlingen settes på vent i brev-steget', async () => {
        // Arrange
        axiosRequest.mockResolvedValue({ status: RessursStatus.SUKSESS, data: 'pdf' });
        mockBehandling(lagBehandling({ steg: StegType.BREV, status: BehandlingStatus.UTREDES }), true);
        const { screen, rerender } = render(
            <OpprettholdVedtak behandlingId={BEHANDLING_ID} fagsystem={Fagsystem.BA} />
        );
        expect(await screen.findByText('Brevmottakere')).toBeInTheDocument();

        // Act
        mockBehandling(lagBehandling({ steg: StegType.BREV, status: BehandlingStatus.SATT_PÅ_VENT }), false);
        rerender(<OpprettholdVedtak behandlingId={BEHANDLING_ID} fagsystem={Fagsystem.BA} />);

        // Assert
        expect(screen.getByText('Brevet kan vises når behandlingen tas av vent.')).toBeInTheDocument();
        expect(screen.queryByText('Brevmottakere')).not.toBeInTheDocument();
        expect(axiosRequest).toHaveBeenCalledTimes(1);
        expect(axiosRequest).toHaveBeenCalledWith({ method: 'POST', url: GENERER_URL });
    });
});
