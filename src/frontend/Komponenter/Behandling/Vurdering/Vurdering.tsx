import * as React from 'react';
import { useEffect, useState } from 'react';
import { useApp } from '../../../App/context/AppContext';
import styled from 'styled-components';
import { Alert, Button } from '@navikt/ds-react';
import { FormkravOppsummering } from './FormkravOppsummering';
import { Vedtak } from './Vedtak';
import { Årsak } from './Årsak';
import { HjemmelVelger } from './HjemmelVelger';
import {
    hjemmelTilTekst,
    IVurdering,
    VedtakValg,
    vedtakValgTilTekst,
    årsakValgTilTekst,
} from './vurderingValg';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../App/typer/ressurs';
import { IFormkravVilkår } from '../Formkrav/typer';
import { hentBehandlingIdFraUrl } from '../BehandlingContainer';
import { useNavigate } from 'react-router-dom';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { VurderingLesemodus } from './VurderingLesemodus';
import { alleVilkårOppfylt } from '../Formkrav/utils';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { AddCircle, Delete } from '@navikt/ds-icons';
import { EnsligTextArea } from '../../../Felles/Input/EnsligTextArea';
import { harVerdi } from '../../../App/utils/utils';

const FritekstFeltWrapper = styled.div`
    margin: 2rem 4rem 2rem 4rem;
`;

const InterntNotatWrapper = styled.div`
    margin: 0 4rem 2rem 4rem;
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

const InternNotatKnappContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-right: 4rem;
    margin-bottom: -2rem;
`;

interface IMelding {
    tekst: string;
    type: 'success' | 'error';
}

const erAlleFelterUtfylt = (vurderingData: IVurdering): boolean => {
    const { vedtak, innstillingKlageinstans, arsak, hjemmel } = vurderingData;

    if (vedtak === VedtakValg.OMGJØR_VEDTAK) {
        return harVerdi(arsak);
    } else if (vedtak === VedtakValg.OPPRETTHOLD_VEDTAK) {
        return harVerdi(innstillingKlageinstans) && harVerdi(hjemmel);
    } else {
        return false;
    }
};
export const Vurdering: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const [formkrav, settFormkrav] = useState<Ressurs<IFormkravVilkår>>(byggTomRessurs());
    const [vurdering, settVurdering] = useState<Ressurs<IVurdering>>(byggTomRessurs());
    const [senderInn, settSenderInn] = useState<boolean>(false);
    const [melding, settMelding] = useState<IMelding>();
    const [skalViseInterntNotat, settSkalViseInterntNotat] = useState<boolean>(false);

    const navigate = useNavigate();

    const {
        vurderingData,
        settVurderingData,
        vurderingEndret,
        settVurderingEndret,
        hentBehandlingshistorikk,
        hentBehandling,
        behandlingErRedigerbar,
    } = useBehandling();
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();

    useEffect(() => {
        axiosRequest<IFormkravVilkår, null>({
            method: 'GET',
            url: `/familie-klage/api/formkrav/vilkar/${behandlingId}`,
        }).then(settFormkrav);
    }, [axiosRequest, behandlingId, settFormkrav]);

    useEffect(() => {
        if (vurdering.status === RessursStatus.SUKSESS && vurdering.data != null) {
            settVurderingData(vurdering.data);
            settSkalViseInterntNotat(harVerdi(vurdering.data.interntNotat));
        } else settVurderingEndret(true);
    }, [vurdering, settVurderingEndret, settVurderingData]);

    useEffect(() => {
        axiosRequest<IVurdering, null>({
            method: 'GET',
            url: `/familie-klage/api/vurdering/${behandlingId}`,
        }).then(settVurdering);
    }, [axiosRequest, behandlingId, settVurderingData, settVurderingEndret]);

    const opprettVurdering = () => {
        if (senderInn) {
            return;
        }

        settSenderInn(true);
        settMelding(undefined);
        axiosRequest<IVurdering, IVurdering>({
            method: 'POST',
            url: `/familie-klage/api/vurdering`,
            data: vurderingData,
        }).then((res: RessursSuksess<IVurdering> | RessursFeilet) => {
            if (res.status === RessursStatus.SUKSESS) {
                nullstillIkkePersisterteKomponenter();
                settMelding({
                    tekst: 'Vurderingen er lagret',
                    type: 'success',
                });
            } else {
                settMelding({
                    tekst: res.frontendFeilmelding || 'Noe gikk galt ved innsending',
                    type: 'error',
                });
            }
            settSenderInn(false);
            settVurderingEndret(false);
            hentBehandling.rerun();
            hentBehandlingshistorikk.rerun();
        });
    };

    function navigerTilBrev() {
        navigate(`/behandling/${hentBehandlingIdFraUrl()}/brev`);
    }

    return (
        <DataViewer response={{ formkrav, vurdering }}>
            {({ formkrav }) => {
                return (
                    <>
                        <FormkravOppsummering
                            formkrav={formkrav}
                            alleVilkårOppfylt={alleVilkårOppfylt(formkrav)}
                        />
                        {behandlingErRedigerbar && !alleVilkårOppfylt(formkrav) && (
                            <Alert variant={'error'}>Noen formkrav er ikke oppfylt</Alert>
                        )}
                        {!behandlingErRedigerbar && alleVilkårOppfylt(formkrav) && (
                            <VurderingLesemodus />
                        )}
                        {alleVilkårOppfylt(formkrav) && behandlingErRedigerbar && (
                            <>
                                <Vedtak
                                    settVedtak={settVurderingData}
                                    vedtakValgt={vurderingData.vedtak}
                                    vedtakValgmuligheter={vedtakValgTilTekst}
                                    endring={settIkkePersistertKomponent}
                                />
                                {vurderingData.vedtak == VedtakValg.OMGJØR_VEDTAK && (
                                    <Årsak
                                        settÅrsak={settVurderingData}
                                        årsakValgt={vurderingData.arsak}
                                        årsakValgmuligheter={årsakValgTilTekst}
                                        endring={settIkkePersistertKomponent}
                                    />
                                )}
                                {vurderingData.vedtak == VedtakValg.OPPRETTHOLD_VEDTAK && (
                                    <>
                                        <HjemmelVelger
                                            settHjemmel={settVurderingData}
                                            hjemmelValgt={vurderingData.hjemmel}
                                            hjemmelValgmuligheter={hjemmelTilTekst}
                                            endring={settIkkePersistertKomponent}
                                        />
                                        <FritekstFeltWrapper>
                                            <EnsligTextArea
                                                label="Innstilling til NAV Klageinstans"
                                                value={vurderingData.innstillingKlageinstans}
                                                onChange={(e) => {
                                                    settIkkePersistertKomponent(e.target.value);
                                                    settVurderingData((tidligereTilstand) => ({
                                                        ...tidligereTilstand,
                                                        innstillingKlageinstans: e.target.value,
                                                    }));
                                                    settVurderingEndret(true);
                                                }}
                                                size="medium"
                                                erLesevisning={false}
                                            />
                                        </FritekstFeltWrapper>
                                    </>
                                )}
                                <InternNotatKnappContainer>
                                    {!skalViseInterntNotat && (
                                        <Button
                                            variant={'tertiary'}
                                            hidden={skalViseInterntNotat}
                                            icon={<AddCircle />}
                                            onClick={() => settSkalViseInterntNotat(true)}
                                        >
                                            Skriv internt notat
                                        </Button>
                                    )}
                                    {skalViseInterntNotat && (
                                        <Button
                                            variant={'tertiary'}
                                            hidden={!skalViseInterntNotat}
                                            icon={<Delete />}
                                            onClick={() => {
                                                settSkalViseInterntNotat(false);
                                                settVurderingData((prevState) => ({
                                                    ...prevState,
                                                    interntNotat: undefined,
                                                }));
                                            }}
                                        >
                                            Fjern internt notat
                                        </Button>
                                    )}
                                </InternNotatKnappContainer>
                                {skalViseInterntNotat && (
                                    <InterntNotatWrapper>
                                        <EnsligTextArea
                                            hidden={!skalViseInterntNotat}
                                            label={'Internt notat'}
                                            erLesevisning={!behandlingErRedigerbar}
                                            onChange={(e) =>
                                                settVurderingData((prevState) => ({
                                                    ...prevState,
                                                    interntNotat: e.target.value,
                                                }))
                                            }
                                            value={vurderingData?.interntNotat}
                                        />
                                    </InterntNotatWrapper>
                                )}
                                <VurderingKnapper>
                                    {(vurderingEndret || melding?.type === 'error') && (
                                        <Button
                                            variant="primary"
                                            size="medium"
                                            onClick={opprettVurdering}
                                            disabled={!erAlleFelterUtfylt(vurderingData)}
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
