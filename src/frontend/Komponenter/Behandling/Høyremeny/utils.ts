import { HøyremenyHendelse, IBehandlingshistorikk } from './behandlingshistorikk';

export const mapHøyremenyHendelseTilHistorikkInnslag = (
    behandlingshistorikk: IBehandlingshistorikk[]
) =>
    behandlingshistorikk.reduce(
        (
            acc: Map<HøyremenyHendelse, IBehandlingshistorikk[]>,
            historikk: IBehandlingshistorikk
        ) => {
            const hendelseType = historikk.historikkHendelse ?? historikk.steg;
            return new Map(acc).set(hendelseType, [...(acc.get(hendelseType) ?? []), historikk]);
        },
        new Map<HøyremenyHendelse, IBehandlingshistorikk[]>()
    );

export const utledNyesteHistorikkInnslagPerUnikeHendelse = (
    map: Map<HøyremenyHendelse, IBehandlingshistorikk[]>
) =>
    Array.from(map.values()).map((historikkInnslagListe: IBehandlingshistorikk[]) =>
        historikkInnslagListe.reduce((nyesteForekomst, current) =>
            Date.parse(current.endretTid) > Date.parse(nyesteForekomst.endretTid)
                ? current
                : nyesteForekomst
        )
    );
