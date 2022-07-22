import { IBehandlingshistorikk } from '../Høyremeny/behandlingshistorikk';
import { StegType } from '../../../App/typer/fagsak';

export const StegHistorikkResultat = (steg: IBehandlingshistorikk[]) => {
    const visning = [
        ...new Set(
            steg.map((historikk, _, historikkListe) =>
                historikkListe.find((steg) => historikk.steg == steg.steg)
            )
        ),
    ];
    return visning.reverse();
};

export const fullførteSteg = (historikk: IBehandlingshistorikk[]) => {
    const fullført: StegType[] = [];
    historikk.map((item) => fullført.push(item.steg));
    return fullført;
};
