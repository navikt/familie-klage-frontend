import { PåklagetVedtak } from '../Komponenter/Behandling/Formkrav/typer';
import { PåklagetVedtakstype } from '../App/typer/fagsak';

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
