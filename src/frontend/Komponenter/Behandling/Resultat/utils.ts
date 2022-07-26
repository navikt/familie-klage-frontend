import { IBehandlingshistorikk } from '../Høyremeny/behandlingshistorikk';
import { StegType } from '../../../App/typer/fagsak';
import { ensure } from '../../../App/utils/utils';

export const StegHistorikkResultat = (steg: IBehandlingshistorikk[]) => {
    const visning = [
        ...new Set(
            steg.map((historikk, _, historikkListe) =>
                ensure(historikkListe.find((steg) => historikk.steg == steg.steg))
            )
        ),
    ];
    return visning;
};

export const fullførteSteg = (liste: IBehandlingshistorikk[]) => {
    return liste.map((item) => item.steg);
};

export const finnBehandlinghistorikkFraListe = (liste: IBehandlingshistorikk[], item: StegType) => {
    return liste.find((obj) => {
        return obj.steg === item;
    });
};
