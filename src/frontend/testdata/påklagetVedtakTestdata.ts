import { PåklagetVedtakstype } from '../App/typer/fagsak';
import type { PåklagetVedtak } from '../Komponenter/Behandling/Formkrav/typer';

export function lagPåklagetVedtak(påklagetVedtak?: Partial<PåklagetVedtak>): PåklagetVedtak {
    return {
        eksternFagsystemBehandlingId: undefined,
        internKlagebehandlingId: undefined,
        påklagetVedtakstype: PåklagetVedtakstype.IKKE_VALGT,
        fagsystemVedtak: undefined,
        manuellVedtaksdato: undefined,
        ...påklagetVedtak,
    };
}

export * as PåklagetVedtakTestdata from './påklagetVedtakTestdata';
