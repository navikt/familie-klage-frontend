import { IBehandlingshistorikk } from './behandlingshistorikk';

export const utledSisteHistorikkInnslagPerKjede = (historikkListe: IBehandlingshistorikk[]) =>
    historikkListe
        .sort((first, second) => Date.parse(first.endretTid) - Date.parse(second.endretTid))
        .reduce(
            (
                acc: IBehandlingshistorikk[],
                currentHistorikkInnslag: IBehandlingshistorikk,
                index
            ) => {
                const currentHistorikkHendelse =
                    currentHistorikkInnslag.historikkHendelse ?? currentHistorikkInnslag.steg;
                const nextHistorikkInnslag =
                    index + 1 < historikkListe.length ? historikkListe[index + 1] : null;
                const nextHistorikkHendelse =
                    nextHistorikkInnslag?.historikkHendelse ?? nextHistorikkInnslag?.steg;

                return currentHistorikkHendelse === nextHistorikkHendelse
                    ? acc
                    : [...acc, currentHistorikkInnslag];
            },
            [] as IBehandlingshistorikk[]
        )
        .sort((first, second) => Date.parse(second.endretTid) - Date.parse(first.endretTid));
