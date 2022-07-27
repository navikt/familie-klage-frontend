// React
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useApp } from '../../../App/context/AppContext';

// CSS
import styled from 'styled-components';

// Komponenter
import { Alert, Button, Textarea } from '@navikt/ds-react';
import { FormkravOppsummering } from './FormkravOppsummering';
import { Vedtak } from './Vedtak';
import { Årsak } from './Årsak';
import { Hjemmel } from './Hjemmel';
import {
    HjemmelValg,
    hjemmelValgTilTekst,
    IVurdering,
    VedtakValg,
    vedtakValgTilTekst,
    ÅrsakValg,
    årsakValgTilTekst,
} from './vurderingValg';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { IFormVilkår, VilkårStatus } from '../Formkrav/utils';
import { hentBehandlingIdFraUrl } from '../BehandlingContainer';
import { useNavigate } from 'react-router-dom';
import { useBehandling } from '../../../App/context/BehandlingContext';

const VurderingBeskrivelseStyled = styled.div`
    margin: 2rem 4rem 2rem 4rem;
`;

const AlertStyled = styled(Alert)`
    margin: 2rem 4rem 2rem 4rem;
`;

const VurderingKnapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 4rem;
`;

const VurderingKnappStyled = styled(Button)``;

export const Vurdering: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    // Formkravoppsummering
    const [oppfylt, settOppfylt] = useState(0);
    const [muligOppfylt, settMuligOppfylt] = useState(0);
    const [begrunnelse, settBegrunnelse] = useState('Ingen begrunnelse');
    const [feilmelding, settFeilmelding] = useState('Dette er en feilmelding'); // TODO legge til enum-objekter som sier om det er begrunnelse eller vurdering som mangler
    const navigate = useNavigate();
    const { settVurderingSideGyldig, settBrevSteg, settResultatSteg } = useBehandling();

    const vurderingObject: IVurdering = {
        behandlingId: behandlingId,
        vedtak: VedtakValg.VELG,
        arsak: ÅrsakValg.VELG,
        hjemmel: HjemmelValg.VELG,
        beskrivelse: '',
    };

    const [vurderingData, settVurderingData] = useState<IVurdering>(vurderingObject);

    // Resultat
    const [resultat, settResultat] = useState(false);

    // Endringer
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();

    useEffect(() => {
        settResultat(false);
    }, [vurderingData, settResultat]);

    // Hent data fra formkrav
    useEffect(() => {
        axiosRequest<IFormVilkår, null>({
            method: 'GET',
            url: `/familie-klage/api/formkrav/vilkar/${behandlingId}`,
        }).then((res: Ressurs<IFormVilkår>) => {
            if (res.status === RessursStatus.SUKSESS) {
                if (res.data.saksbehandlerBegrunnelse !== '')
                    settBegrunnelse(res.data.saksbehandlerBegrunnelse);

                const vilkårListe = [
                    res.data.klagePart,
                    res.data.klageKonkret,
                    res.data.klagefristOverholdt,
                    res.data.klageSignert,
                ];
                settOppfylt(vilkårListe.filter((item: VilkårStatus) => item === 'OPPFYLT').length);
                settMuligOppfylt(vilkårListe.length);
            }
        });
    }, [axiosRequest, behandlingId]);

    // Hent eksisterende vurderingsdata
    useEffect(() => {
        axiosRequest<IVurdering, null>({
            method: 'GET',
            url: `/familie-klage/api/vurdering/${behandlingId}`,
        }).then((res: Ressurs<IVurdering>) => {
            if (res.status === RessursStatus.SUKSESS) {
                settVurderingData({
                    behandlingId: behandlingId,
                    vedtak: res.data.vedtak,
                    arsak: res.data.arsak,
                    hjemmel: res.data.hjemmel,
                    beskrivelse: res.data.beskrivelse,
                });
            }
        });
    }, [axiosRequest, settVurderingData, behandlingId]);

    const opprettVurdering = () => {
        const v: IVurdering = {
            behandlingId: behandlingId,
            vedtak: vurderingData.vedtak,
            beskrivelse: vurderingData.beskrivelse,
        };

        if (vurderingData.vedtak == VedtakValg.OMGJØR_VEDTAK) {
            v.arsak = vurderingData.arsak;
        } else {
            v.hjemmel = vurderingData.hjemmel;
        }

        axiosRequest<IVurdering, IVurdering>({
            method: 'POST',
            url: `/familie-klage/api/vurdering`,
            data: v,
        }).then((res: Ressurs<IVurdering>) => {
            if (res.status === RessursStatus.SUKSESS) {
                settResultat(true);
                nullstillIkkePersisterteKomponenter();
                settVurderingSideGyldig(true);
                settBrevSteg(true);
            }
        });
    };

    return (
        <div>
            <FormkravOppsummering
                oppfylt={oppfylt}
                muligOppfylt={muligOppfylt}
                begrunnelse={begrunnelse}
                feilmelding={feilmelding}
            />
            {oppfylt < muligOppfylt || muligOppfylt == 0 ? (
                ''
            ) : (
                <>
                    <Vedtak
                        settVedtak={settVurderingData}
                        vedtakValgmuligheter={vedtakValgTilTekst}
                        vedtakValgt={vurderingData.vedtak}
                        endring={settIkkePersistertKomponent}
                    />
                    {vurderingData.vedtak == VedtakValg.OMGJØR_VEDTAK &&
                    vurderingData.arsak !== undefined ? (
                        <Årsak
                            settÅrsak={settVurderingData}
                            årsakValgt={vurderingData.arsak}
                            årsakValgmuligheter={årsakValgTilTekst}
                            endring={settIkkePersistertKomponent}
                        />
                    ) : (
                        ''
                    )}
                    {vurderingData.vedtak == VedtakValg.OPPRETTHOLD_VEDTAK &&
                    vurderingData.hjemmel !== undefined ? (
                        <Hjemmel
                            settHjemmel={settVurderingData}
                            hjemmelValgt={vurderingData.hjemmel}
                            hjemmelValgmuligheter={hjemmelValgTilTekst}
                            endring={settIkkePersistertKomponent}
                        />
                    ) : (
                        ''
                    )}
                    {vurderingData.vedtak == VedtakValg.OPPRETTHOLD_VEDTAK ||
                    vurderingData.vedtak == VedtakValg.OMGJØR_VEDTAK ? (
                        <VurderingBeskrivelseStyled>
                            <Textarea
                                label="Vurdering"
                                value={vurderingData.beskrivelse}
                                onChange={(e) => {
                                    settBrevSteg(false);
                                    settResultatSteg(false);
                                    settIkkePersistertKomponent(e.target.value);
                                    settVurderingData((tidligereTilstand) => ({
                                        ...tidligereTilstand,
                                        beskrivelse: e.target.value,
                                    }));
                                }}
                                size="medium"
                            />
                        </VurderingBeskrivelseStyled>
                    ) : (
                        ''
                    )}
                    {resultat ? (
                        <AlertStyled variant="success" size="medium" inline>
                            Du har lagret vurderingen.
                        </AlertStyled>
                    ) : (
                        ''
                    )}
                    <VurderingKnapper>
                        <VurderingKnappStyled
                            variant="primary"
                            size="medium"
                            onClick={() => {
                                opprettVurdering();
                            }}
                            disabled={
                                !(
                                    vurderingData.vedtak == VedtakValg.OPPRETTHOLD_VEDTAK ||
                                    vurderingData.vedtak == VedtakValg.OMGJØR_VEDTAK
                                ) ||
                                vurderingData.beskrivelse.length == 0 ||
                                (vurderingData.arsak == ÅrsakValg.VELG &&
                                    vurderingData.hjemmel == HjemmelValg.VELG)
                            }
                        >
                            Lagre vurdering
                        </VurderingKnappStyled>
                        {resultat && (
                            <Button
                                onClick={() =>
                                    navigate(`/behandling/${hentBehandlingIdFraUrl()}/brev`)
                                }
                                disabled={
                                    !(
                                        vurderingData.vedtak == VedtakValg.OPPRETTHOLD_VEDTAK ||
                                        vurderingData.vedtak == VedtakValg.OMGJØR_VEDTAK
                                    ) ||
                                    vurderingData.beskrivelse.length == 0 ||
                                    (vurderingData.arsak == ÅrsakValg.VELG &&
                                        vurderingData.hjemmel == HjemmelValg.VELG)
                                }
                            >
                                Fortsett
                            </Button>
                        )}
                    </VurderingKnapper>
                </>
            )}
        </div>
    );
};
