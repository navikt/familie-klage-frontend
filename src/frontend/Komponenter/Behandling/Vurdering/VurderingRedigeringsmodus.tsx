import * as React from 'react';
import { useState } from 'react';
import { useApp } from '../../../App/context/AppContext';
import styled from 'styled-components';
import { Alert, Button } from '@navikt/ds-react';
import { Vedtak } from './Vedtak';
import { Årsak } from './Årsak';
import { HjemmelVelger } from './HjemmelVelger';
import { IVurdering, VedtakValg, vedtakValgTilTekst } from './vurderingValg';
import { useNavigate } from 'react-router-dom';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { EnsligTextArea } from '../../../Felles/Input/EnsligTextArea';
import { harVerdi } from '../../../App/utils/utils';
import { InterntNotat } from './InterntNotat';
import { useHentVurderinger } from '../../../App/hooks/useHentVurderinger';
import { Behandling, Fagsystem } from '../../../App/typer/fagsak';
import { InnstillingTilNavKlageinstans } from './InnstillingTilNavKlageinstans/InnstillingTilNavKlageinstans';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';

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

interface VurderingRedigeringsmodusProps {
    behandling: Behandling;
    vurdering: IVurdering | null;
}

export const VurderingRedigeringsmodus = ({
    behandling,
    vurdering,
}: VurderingRedigeringsmodusProps) => {
    const [senderInn, settSenderInn] = useState<boolean>(false);

    const navigate = useNavigate();

    const {
        vurderingEndret,
        settVurderingEndret,
        hentBehandlingshistorikk,
        hentBehandling,
        behandlingErRedigerbar,
    } = useBehandling();

    const { lagreVurderingOgOppdaterSteg, melding, settMelding } = useHentVurderinger();
    const { nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } = useApp();

    const initiellVurdering: IVurdering = { behandlingId: behandling.id };
    const [oppdatertVurdering, settOppdatertVurdering] = useState<IVurdering>(() => {
        if (vurdering === null) {
            settVurderingEndret(true);
            return initiellVurdering;
        }
        return vurdering;
    });

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
        lagreVurderingOgOppdaterSteg(vurderingSomSkalLagres).then((res: Ressurs<IVurdering>) => {
            if (res.status === RessursStatus.SUKSESS) {
                nullstillIkkePersisterteKomponenter();
            }
            settSenderInn(false);
            settVurderingEndret(false);
            hentBehandling.rerun();
            hentBehandlingshistorikk.rerun();
        });
    };

    function navigerTilBrev() {
        navigate(`/behandling/${behandling.id}/brev`);
    }

    return (
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
                        settIkkePersistertKomponent={settIkkePersistertKomponent}
                        settOppdatertVurdering={settOppdatertVurdering}
                        settVurderingEndret={settVurderingEndret}
                    />
                    <InterntNotat
                        behandlingErRedigerbar={behandlingErRedigerbar}
                        vurderingEndret={vurderingEndret}
                        settVurderingEndret={settVurderingEndret}
                        tekst={oppdatertVurdering?.interntNotat}
                        settIkkePersistertKomponent={settIkkePersistertKomponent}
                        settOppdatertVurdering={settOppdatertVurdering}
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
                            !erAlleFelterUtfylt(oppdatertVurdering, behandling.fagsystem) ||
                            senderInn
                        }
                        loading={senderInn}
                    >
                        Lagre vurdering
                    </Button>
                )}
                {!vurderingEndret && melding?.type !== 'error' && (
                    <Button variant="primary" size="medium" onClick={navigerTilBrev}>
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
    );
};
