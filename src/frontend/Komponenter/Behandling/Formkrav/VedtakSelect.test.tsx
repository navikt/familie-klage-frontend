import { useState } from 'react';
import { describe, expect, test } from 'vitest';
import { BehandlingStatus } from '../../../App/typer/behandlingstatus';
import { BehandlingResultat, Fagsystem, PåklagetVedtakstype } from '../../../App/typer/fagsak';
import type { FagsystemVedtak } from '../../../App/typer/fagsystemVedtak';
import type { Klagebehandlingsresultat } from '../../../App/typer/klagebehandlingsresultat';
import { render } from '../../../lib/testrender';
import { PåklagetVedtakTestdata } from '../../../testdata/påklagetVedtakTestdata';
import type { IFormkravVilkår, PåklagetVedtak } from './typer';
import { FagsystemType, FormkravFristUnntak, VilkårStatus } from './typer';
import { VedtakSelect } from './VedtakSelect';

const fagsystemVedtak: FagsystemVedtak[] = [
    {
        behandlingstype: 'Revurdering',
        resultat: 'Endret utbetaling',
        eksternBehandlingId: '123',
        vedtakstidspunkt: '2026-10-01T10:00:00.000',
        fagsystemType: FagsystemType.ORDNIÆR,
    },
    {
        behandlingstype: 'Førstegangsbehandling',
        resultat: 'Innvilget',
        eksternBehandlingId: '122',
        vedtakstidspunkt: '2026-08-01T10:00:00.000',
        fagsystemType: FagsystemType.ORDNIÆR,
    },
];

const avvistKlage: Klagebehandlingsresultat = {
    id: 'b1c2d3e4-0000-4000-8000-000000000000',
    fagsakId: '432d7bb9-be04-4554-8e73-ba95343d28ad',
    fagsakPersonId: '8a1d2f3c-0000-4000-8000-000000000000',
    status: BehandlingStatus.FERDIGSTILT,
    opprettet: '2026-09-20T10:00:00.000',
    mottattDato: '2026-09-20',
    resultat: BehandlingResultat.IKKE_MEDHOLD_FORMKRAV_AVVIST,
    vedtaksdato: '2026-09-23T10:00:00.000',
};

function VedtakSelectMedState({ påklagetVedtak }: { påklagetVedtak: PåklagetVedtak }) {
    const [vurderinger, settVurderinger] = useState<IFormkravVilkår>({
        behandlingId: '54f95e94-9215-474b-9882-f6e992a9d3cc',
        klagePart: VilkårStatus.IKKE_SATT,
        klageKonkret: VilkårStatus.IKKE_SATT,
        klagefristOverholdt: VilkårStatus.IKKE_SATT,
        klagefristOverholdtUnntak: FormkravFristUnntak.IKKE_SATT,
        klageSignert: VilkårStatus.IKKE_SATT,
        påklagetVedtak,
        endretTid: '2026-10-01T10:00:00.000',
    });

    return (
        <VedtakSelect
            settOppdaterteVurderinger={settVurderinger}
            vedtak={fagsystemVedtak}
            vurderinger={vurderinger}
            fagsystem={Fagsystem.BA}
            klagebehandlingsresultater={[avvistKlage]}
        />
    );
}

describe('VedtakSelect', () => {
    const comboboxName = 'Vedtak som er påklaget';
    const fagsystemVedtakTekst = 'Førstegangsbehandling - Innvilget - 01.08.2026 kl.10:00';
    const avvistKlageTekst = 'Avvist klage - 23.09.2026 kl.10:00';

    test('skal vise fagsystemvedtak som valgt når saksbehandler velger fagsystemvedtak', async () => {
        // Arrange
        const { screen, user } = render(
            <VedtakSelectMedState påklagetVedtak={PåklagetVedtakTestdata.lagPåklagetVedtak()} />
        );
        const combobox = screen.getByRole('combobox', { name: comboboxName });

        // Act
        await user.selectOptions(combobox, screen.getByRole('option', { name: fagsystemVedtakTekst }));

        // Assert
        expect(combobox).toHaveDisplayValue(fagsystemVedtakTekst);
    });

    test('skal vise avvist klage som valgt når saksbehandler velger avvist klage', async () => {
        // Arrange
        const { screen, user } = render(
            <VedtakSelectMedState påklagetVedtak={PåklagetVedtakTestdata.lagPåklagetVedtak()} />
        );
        const combobox = screen.getByRole('combobox', { name: comboboxName });

        // Act
        await user.selectOptions(combobox, screen.getByRole('option', { name: avvistKlageTekst }));

        // Assert
        expect(combobox).toHaveDisplayValue(avvistKlageTekst);
    });

    test('skal vise avvist klage som valgt når påklaget vedtak allerede er avvist klage', () => {
        // Arrange
        const påklagetVedtak = PåklagetVedtakTestdata.lagPåklagetVedtak({
            påklagetVedtakstype: PåklagetVedtakstype.AVVIST_KLAGE,
            internKlagebehandlingId: avvistKlage.id,
        });

        // Act
        const { screen } = render(<VedtakSelectMedState påklagetVedtak={påklagetVedtak} />);

        // Assert
        expect(screen.getByRole('combobox', { name: comboboxName })).toHaveDisplayValue(avvistKlageTekst);
    });
});
