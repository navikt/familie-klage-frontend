import { IBehandlingshistorikk } from './behandlingshistorikk';
import { HistorikkHendelse, StegType } from '../../../App/typer/fagsak';
import {
    mapHøyremenyHendelseTilHistorikkInnslag,
    utledNyesteHistorikkInnslagPerUnikeHendelse,
} from './utils';

describe('høyremeny utils tester', () => {
    test('utled nyeste innslag per unike historikkhendelse', () => {
        const stegTypeTilHistorikkInnslag =
            mapHøyremenyHendelseTilHistorikkInnslag(behandlingshistorikk);
        const sisteInnslagPerUnikeHistorikkHendelse = utledNyesteHistorikkInnslagPerUnikeHendelse(
            stegTypeTilHistorikkInnslag
        );

        expect(
            sisteInnslagPerUnikeHistorikkHendelse.map(
                (historikkInnslag) => historikkInnslag.endretTid
            )
        ).toEqual([
            '2025-09-16T16:05:01.624491',
            '2025-09-16T16:04:58.674151',
            '2025-09-16T16:04:31.781598',
            '2025-09-10T10:07:13.283707',
            '2025-09-10T09:17:55.553389',
        ]);
    });

    const behandlingshistorikk: IBehandlingshistorikk[] = [
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: HistorikkHendelse.TATT_AV_VENT,
            steg: StegType.BREV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-16T16:05:01.624491',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: HistorikkHendelse.SATT_PÅ_VENT,
            steg: StegType.BREV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-16T16:04:58.674151',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.VURDERING,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-16T16:04:31.781598',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.VURDERING,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-16T15:47:40.325416',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.FORMKRAV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-10T10:07:13.283707',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.FORMKRAV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-10T10:07:10.03921',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.FORMKRAV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-10T10:07:03.854467',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.FORMKRAV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-10T10:06:58.951457',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.FORMKRAV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-10T09:59:09.862755',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.FORMKRAV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-10T09:57:14.437315',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.FORMKRAV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-10T09:46:08.21053',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.FORMKRAV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-10T09:46:05.023435',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.FORMKRAV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-10T09:45:58.466781',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.FORMKRAV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-10T09:45:29.742199',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.FORMKRAV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-10T09:45:21.602196',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.FORMKRAV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-10T09:31:39.368126',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.FORMKRAV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-10T09:31:30.178338',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.FORMKRAV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-10T09:31:25.957344',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.FORMKRAV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-10T09:31:20.368275',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.FORMKRAV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-10T09:31:16.106314',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.FORMKRAV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-10T09:31:08.515388',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.FORMKRAV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-10T09:30:48.103551',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.FORMKRAV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-10T09:27:09.692206',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.FORMKRAV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-10T09:26:45.981685',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.FORMKRAV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-10T09:26:36.477745',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.FORMKRAV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-10T09:24:54.465988',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.FORMKRAV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-10T09:22:41.150203',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.FORMKRAV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-10T09:21:33.26012',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.FORMKRAV,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-10T09:19:28.207028',
        },
        {
            behandlingId: '6a8b9e0b-91a9-493f-8258-be19f80c8afe',
            historikkHendelse: undefined,
            steg: StegType.OPPRETTET,
            opprettetAv: 'Z993224',
            endretTid: '2025-09-10T09:17:55.553389',
        },
    ];
});
