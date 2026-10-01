import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render } from '../../lib/testrender';
import { lagBehandling } from '../../testdata/behandlingTestdata';
import { BehandlingStatus } from '../typer/behandlingstatus';
import type { Behandling } from '../typer/fagsak';
import { StegType } from '../typer/fagsak';
import { RessursStatus } from '../typer/ressurs';
import { BehandlingProvider, useBehandling } from './BehandlingContext';

const { useHentBehandling } = vi.hoisted(() => ({ useHentBehandling: vi.fn() }));

vi.mock('react-router-dom', () => ({ useParams: () => ({ behandlingId: 'behandling-id' }) }));
vi.mock('../hooks/useHentBehandling', () => ({ useHentBehandling }));
vi.mock('../hooks/useHentPersonopplysninger', () => ({
    useHentPersonopplysninger: () => ({ hentPersonopplysninger: () => undefined }),
}));
vi.mock('../hooks/useHentBehandlingHistorikk', () => ({
    useHentBehandlingHistorikk: () => ({ hentBehandlingshistorikkCallback: () => undefined }),
}));
vi.mock('../hooks/useHentFormkravVilkår', () => ({
    useHentFormkravVilkår: () => ({ vilkårsvurderinger: {}, hentVilkårsvurderinger: () => undefined }),
}));
vi.mock('../hooks/useHentAnsvarligSaksbehandler', () => ({
    useHentAnsvarligSaksbehandler: () => ({ hentAnsvarligSaksbehandlerCallback: () => undefined }),
}));

const renderteVerdier: boolean[] = [];

const RegistrerRedigerbar = () => {
    renderteVerdier.push(useBehandling().behandlingErRedigerbar);
    return null;
};

function mockBehandling(behandling: Behandling) {
    useHentBehandling.mockReturnValue({
        hentBehandlingCallback: () => undefined,
        behandling: { status: RessursStatus.SUKSESS, data: behandling },
    });
}

describe('BehandlingContext', () => {
    beforeEach(() => {
        renderteVerdier.length = 0;
    });

    test('skal aldri være redigerbar når behandlingen er satt på vent', () => {
        // Arrange
        mockBehandling(lagBehandling({ steg: StegType.BREV, status: BehandlingStatus.SATT_PÅ_VENT }));

        // Act
        render(
            <BehandlingProvider>
                <RegistrerRedigerbar />
            </BehandlingProvider>
        );

        // Assert
        expect(renderteVerdier).not.toContain(true);
    });

    test('skal være redigerbar i samme render som behandlingen tas av vent', () => {
        // Arrange
        mockBehandling(lagBehandling({ steg: StegType.BREV, status: BehandlingStatus.SATT_PÅ_VENT }));
        const { rerender } = render(
            <BehandlingProvider>
                <RegistrerRedigerbar />
            </BehandlingProvider>
        );
        renderteVerdier.length = 0;

        // Act
        mockBehandling(lagBehandling({ steg: StegType.BREV, status: BehandlingStatus.UTREDES }));
        rerender(
            <BehandlingProvider>
                <RegistrerRedigerbar />
            </BehandlingProvider>
        );

        // Assert
        expect(renderteVerdier.length).toBeGreaterThan(0);
        expect(renderteVerdier).not.toContain(false);
    });
});
