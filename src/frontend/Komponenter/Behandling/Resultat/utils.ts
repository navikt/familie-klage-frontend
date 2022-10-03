import { IBehandlingshistorikk } from '../Høyremeny/behandlingshistorikk';
import { ensure } from '../../../App/utils/utils';

export const fjernDuplikatStegFraHistorikk = (steg: IBehandlingshistorikk[]) => {
    const visning = [
        ...new Set(
            steg.map((historikk, _, historikkListe) =>
                ensure(historikkListe.find((steg) => historikk.steg == steg.steg))
            )
        ),
    ];
    return visning.reverse();
};
