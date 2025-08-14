import React, { useEffect, useState } from 'react';
import { KlageInfo } from './KlageInfo';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { IFormkravVilkår } from './typer';
import { ToKolonneLayout } from '../../../Felles/Visningskomponenter/ToKolonneLayout';
import { FormkravVurderinger } from './FormkravVurderinger';
import { DataViewer } from '../../../Felles/DataViewer/DataViewer';
import { Behandling } from '../../../App/typer/fagsak';
import { useHentFormkravVilkår } from '../../../App/hooks/useHentFormkravVilkår';
import { utledRedigeringsmodus } from './validerFormkravUtils';
import { useHentFagsystemVedtak } from '../../../App/hooks/useHentFagsystemVedtak';
import { FagsystemVedtak } from '../../../App/typer/fagsystemVedtak';
import { useHentKlagebehandlingsresultater } from '../../../App/hooks/useHentKlagebehandlingsresultater';
import { Klagebehandlingsresultat } from '../../../App/typer/klagebehandlingsresultat';

export const Formkrav: React.FC<{ behandling: Behandling }> = ({ behandling }) => {
    const { vilkårsvurderinger, hentVilkårsvurderinger, lagreVilkårsvurderinger, feilVedLagring } =
        useHentFormkravVilkår();
    const { fagsystemVedtak, hentFagsystemVedtak } = useHentFagsystemVedtak();
    const { klagebehandlingsresultater, hentKlagebehandlingsresultater } =
        useHentKlagebehandlingsresultater();
    const behandlingId = behandling.id;

    useEffect(() => {
        if (vilkårsvurderinger.status === RessursStatus.IKKE_HENTET) {
            hentVilkårsvurderinger(behandlingId);
        }
    }, [behandlingId, vilkårsvurderinger, hentVilkårsvurderinger]);

    useEffect(() => {
        if (fagsystemVedtak.status === RessursStatus.IKKE_HENTET) {
            hentFagsystemVedtak(behandling);
        }
    }, [behandling, fagsystemVedtak, hentFagsystemVedtak]);

    useEffect(() => {
        if (klagebehandlingsresultater.status === RessursStatus.IKKE_HENTET) {
            hentKlagebehandlingsresultater(behandling);
        }
    }, [behandling, klagebehandlingsresultater, hentKlagebehandlingsresultater]);
    return (
        <DataViewer response={{ vilkårsvurderinger, fagsystemVedtak, klagebehandlingsresultater }}>
            {({ vilkårsvurderinger, fagsystemVedtak, klagebehandlingsresultater }) => {
                return (
                    <FormkravKomponent
                        vilkårsvurderinger={vilkårsvurderinger}
                        lagreVurderinger={lagreVilkårsvurderinger}
                        behandling={behandling}
                        feilmelding={feilVedLagring}
                        fagsystemVedtak={fagsystemVedtak}
                        klagebehandlingsresultater={klagebehandlingsresultater}
                    />
                );
            }}
        </DataViewer>
    );
};

const FormkravKomponent: React.FC<{
    vilkårsvurderinger: IFormkravVilkår;
    lagreVurderinger: (
        vurderinger: IFormkravVilkår
    ) => Promise<RessursSuksess<IFormkravVilkår> | RessursFeilet>;
    behandling: Behandling;
    feilmelding: string;
    fagsystemVedtak: FagsystemVedtak[];
    klagebehandlingsresultater: Klagebehandlingsresultat[];
}> = ({
    vilkårsvurderinger,
    lagreVurderinger,
    behandling,
    feilmelding,
    fagsystemVedtak,
    klagebehandlingsresultater,
}) => {
    const { behandlingErRedigerbar } = useBehandling();
    const [oppdaterteVurderinger, settOppdaterteVurderinger] =
        useState<IFormkravVilkår>(vilkårsvurderinger);
    const [redigeringsmodus, settRedigeringsmodus] = useState(
        utledRedigeringsmodus(behandlingErRedigerbar, vilkårsvurderinger)
    );

    useEffect(() => {
        settRedigeringsmodus(utledRedigeringsmodus(behandlingErRedigerbar, vilkårsvurderinger));
    }, [behandlingErRedigerbar, vilkårsvurderinger]);

    return (
        <ToKolonneLayout>
            {{
                venstre: (
                    <KlageInfo
                        behandling={behandling}
                        vurderinger={oppdaterteVurderinger}
                        redigeringsmodus={redigeringsmodus}
                    />
                ),
                høyre: (
                    <FormkravVurderinger
                        vurderinger={oppdaterteVurderinger}
                        settOppdaterteVurderinger={settOppdaterteVurderinger}
                        lagreVurderinger={lagreVurderinger}
                        redigeringsmodus={redigeringsmodus}
                        settRedigeringsmodus={settRedigeringsmodus}
                        feilmelding={feilmelding}
                        fagsystemVedtak={fagsystemVedtak}
                        fagsystem={behandling.fagsystem}
                        klagebehandlingsresultater={klagebehandlingsresultater}
                    />
                ),
            }}
        </ToKolonneLayout>
    );
};
