import { VedtakType } from '../../Komponenter/Behandling/Formkrav/typer';

export interface FagsystemVedtak {
    behandlingstype: string;
    resultat: string;
    eksternBehandlingId: string;
    vedtakstidspunkt: string;
    vedtakType: VedtakType;
}
