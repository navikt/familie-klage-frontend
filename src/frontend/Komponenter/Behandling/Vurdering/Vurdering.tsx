import * as React from 'react';
import { useEffect, useState } from 'react';
import { useApp } from '../../../App/context/AppContext';
import styled from 'styled-components';
import { Alert, Button } from '@navikt/ds-react';
import { Vedtak } from './Vedtak';
import { Årsak } from './Årsak';
import { HjemmelVelger } from './HjemmelVelger';
import { IVurdering, VedtakValg, vedtakValgTilTekst } from './vurderingValg';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../App/typer/ressurs';
import { IFormkravVilkår } from '../Formkrav/typer';
import { useNavigate } from 'react-router-dom';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { VurderingLesemodus } from './VurderingLesemodus';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { EnsligTextArea } from '../../../Felles/Input/EnsligTextArea';
import { harVerdi } from '../../../App/utils/utils';
import { alleVilkårOppfylt, påKlagetVedtakValgt } from '../Formkrav/validerFormkravUtils';
import { InterntNotat } from './InterntNotat';
import { useHentVurderinger } from '../../../App/hooks/useHentVurderinger';
import { Behandling, Fagsystem } from '../../../App/typer/fagsak';
import { InnstillingTilNavKlageinstans } from './InnstillingTilNavKlageinstans/InnstillingTilNavKlageinstans';

const FritekstFeltWrapper = styled.div`
    margin: 2rem 4rem 2rem 4rem;
`;

const AlertStyled = styled(Alert)`
    margin: 2rem 4rem 2rem 4rem;
    width: 25rem;
`;

const VurderingKnapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 4rem;
`;

const erAlleFelterUtfylt = (vurderingData: IVurdering, fagsystem: Fagsystem): boolean => {
    const {
        vedtak,
        innstillingKlageinstans,
        dokumentasjonOgUtredning,
        spørsmåletISaken,
        aktuelleRettskilder,
        klagersAnførsler,
        vurderingAvKlagen,
        årsak,
        hjemmel,
        begrunnelseOmgjøring,
    } = vurderingData;

    if (vedtak === VedtakValg.OMGJØR_VEDTAK) {
        return harVerdi(årsak) && harVerdi(begrunnelseOmgjøring);
    } else if (vedtak === VedtakValg.OPPRETTHOLD_VEDTAK && fagsystem == Fagsystem.EF) {
        return harVerdi(innstillingKlageinstans) && harVerdi(hjemmel);
    } else if (
        vedtak === VedtakValg.OPPRETTHOLD_VEDTAK &&
        (fagsystem == Fagsystem.BA || fagsystem == Fagsystem.KS)
    ) {
        return (
            harVerdi(dokumentasjonOgUtredning) &&
            harVerdi(spørsmåletISaken) &&
            harVerdi(aktuelleRettskilder) &&
            harVerdi(klagersAnførsler) &&
            harVerdi(vurderingAvKlagen) &&
            harVerdi(hjemmel)
        );
    } else {
        return false;
    }
};
export const Vurdering: React.FC<{ behandling: Behandling }> = ({ behandling }) => {
    const [formkrav, settFormkrav] = useState<Ressurs<IFormkravVilkår>>(byggTomRessurs());
    const [senderInn, settSenderInn] = useState<boolean>(false);
    const behandlingId = behandling.id;

    const navigate = useNavigate();

    const {
        oppdatertVurdering,
        settOppdatertVurdering,
        vurderingEndret,
        settVurderingEndret,
        hentBehandlingshistorikk,
        hentBehandling,
        behandlingErRedigerbar,
    } = useBehandling();

    const { vurdering, hentVurdering, lagreVurdering, melding, settMelding } = useHentVurderinger();
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();

    useEffect(() => {
        if (behandlingId !== undefined) {
            if (vurdering.status !== RessursStatus.SUKSESS) {
                hentVurdering(behandlingId);
            }
        }
        // eslint-disable-next-line
    }, [behandlingId, hentVurdering]);

    useEffect(() => {
        axiosRequest<IFormkravVilkår, null>({
            method: 'GET',
            url: `/familie-klage/api/formkrav/vilkar/${behandlingId}`,
        }).then(settFormkrav);
    }, [axiosRequest, behandlingId, settFormkrav]);

    useEffect(() => {
        if (vurdering.status === RessursStatus.SUKSESS && vurdering.data != null) {
            settOppdatertVurdering(vurdering.data);
        } else settVurderingEndret(true);
    }, [vurdering, settVurderingEndret, settOppdatertVurdering]);

    const opprettVurdering = () => {
        if (senderInn) {
            return;
        }

        const vurderingSomSkalLagres =
            oppdatertVurdering.vedtak === VedtakValg.OPPRETTHOLD_VEDTAK
                ? {
                      ...oppdatertVurdering,
                      årsak: undefined,
                      begrunnelseOmgjøring: undefined,
                  }
                : {
                      ...oppdatertVurdering,
                      hjemmel: undefined,
                      innstillingKlageinstans: undefined,
                      interntNotat: undefined,
                  };

        settSenderInn(true);
        settMelding(undefined);
        lagreVurdering(vurderingSomSkalLagres).then(
            (res: RessursSuksess<IVurdering> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    nullstillIkkePersisterteKomponenter();
                }
                settSenderInn(false);
                settVurderingEndret(false);
                hentBehandling.rerun();
                hentBehandlingshistorikk.rerun();
            }
        );
    };

    const oppdaterNotat = (tekst?: string) => {
        settOppdatertVurdering((prevState) => ({
            ...prevState,
            interntNotat: tekst,
        }));
        settIkkePersistertKomponent('internt-notat');
    };

    function navigerTilBrev() {
        navigate(`/behandling/${behandlingId}/brev`);
    }

    return (
        <DataViewer response={{ formkrav }}>
            {({ formkrav }) => {
                const skalViseVurderingsvalg =
                    påKlagetVedtakValgt(formkrav) && alleVilkårOppfylt(formkrav);

                return (
                    <>
                        {behandlingErRedigerbar && !skalViseVurderingsvalg && (
                            <Alert variant={'error'}>Noen formkrav er ikke oppfylt</Alert>
                        )}
                        {!behandlingErRedigerbar && skalViseVurderingsvalg && (
                            <VurderingLesemodus vurdering={oppdatertVurdering} />
                        )}
                        {behandlingErRedigerbar && skalViseVurderingsvalg && (
                            <>
                                <Vedtak
                                    settVedtak={settOppdatertVurdering}
                                    vedtakValgt={oppdatertVurdering.vedtak}
                                    vedtakValgmuligheter={vedtakValgTilTekst}
                                    endring={settIkkePersistertKomponent}
                                />
                                {oppdatertVurdering.vedtak == VedtakValg.OMGJØR_VEDTAK && (
                                    <>
                                        <Årsak
                                            settÅrsak={settOppdatertVurdering}
                                            årsakValgt={oppdatertVurdering.årsak}
                                            fagsystem={behandling.fagsystem}
                                            endring={settIkkePersistertKomponent}
                                        />
                                        <FritekstFeltWrapper>
                                            <EnsligTextArea
                                                label="Begrunnelse for omgjøring (internt notat)"
                                                value={oppdatertVurdering.begrunnelseOmgjøring}
                                                onChange={(e) => {
                                                    settIkkePersistertKomponent(e.target.value);
                                                    settOppdatertVurdering((tidligereTilstand) => ({
                                                        ...tidligereTilstand,
                                                        begrunnelseOmgjøring: e.target.value,
                                                    }));
                                                    settVurderingEndret(true);
                                                }}
                                                size="medium"
                                                readOnly={false}
                                            />
                                        </FritekstFeltWrapper>
                                    </>
                                )}
                                {oppdatertVurdering.vedtak == VedtakValg.OPPRETTHOLD_VEDTAK && (
                                    <>
                                        <HjemmelVelger
                                            settHjemmel={settOppdatertVurdering}
                                            hjemmelValgt={oppdatertVurdering.hjemmel}
                                            endring={settIkkePersistertKomponent}
                                        />
                                        <InnstillingTilNavKlageinstans
                                            behandling={behandling}
                                            oppdatertVurdering={oppdatertVurdering}
                                            settIkkePersistertKomponent={
                                                settIkkePersistertKomponent
                                            }
                                            settOppdatertVurdering={settOppdatertVurdering}
                                            settVurderingEndret={settVurderingEndret}
                                        />
                                        <InterntNotat
                                            behandlingErRedigerbar={behandlingErRedigerbar}
                                            tekst={oppdatertVurdering?.interntNotat}
                                            oppdaterTekst={oppdaterNotat}
                                        />
                                    </>
                                )}
                                <VurderingKnapper>
                                    {(vurderingEndret || melding?.type === 'error') && (
                                        <Button
                                            variant="primary"
                                            size="medium"
                                            onClick={opprettVurdering}
                                            disabled={
                                                !erAlleFelterUtfylt(
                                                    oppdatertVurdering,
                                                    behandling.fagsystem
                                                )
                                            }
                                        >
                                            Lagre vurdering
                                        </Button>
                                    )}
                                    {!vurderingEndret && melding?.type !== 'error' && (
                                        <Button
                                            variant="primary"
                                            size="medium"
                                            onClick={navigerTilBrev}
                                        >
                                            Fortsett
                                        </Button>
                                    )}
                                </VurderingKnapper>
                                {melding && (
                                    <AlertStyled variant={melding.type} size="medium">
                                        {melding.tekst}
                                    </AlertStyled>
                                )}
                            </>
                        )}
                    </>
                );
            }}
        </DataViewer>
    );
};
