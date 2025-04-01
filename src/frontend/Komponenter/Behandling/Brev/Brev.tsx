import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../App/typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';
import styled from 'styled-components';
import { useApp } from '../../../App/context/AppContext';
import { Alert, Button, HGrid, VStack } from '@navikt/ds-react';
import { IVurdering, VedtakValg } from '../Vurdering/vurderingValg';
import PdfVisning from './PdfVisning';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import SystemetLaster from '../../../Felles/SystemetLaster/SystemetLaster';
import BrevMottakere from '../Brevmottakere/ef/BrevMottakere';
import { OmgjørVedtak } from './OmgjørVedtak';
import { Behandling, Fagsystem } from '../../../App/typer/fagsak';
import { BrevmottakerContainer as BaksBrevmottakerContainer } from '../Brevmottakere/baks/BrevmottakerContainer';
import { useFerdigstillBehandling } from './useFerdigstillBehandling';

const Brevside = styled.div`
    background-color: var(--a-bg-subtle);
    padding: 2rem 2rem 0 2rem;
`;

const AlertStripe = styled(Alert)`
    margin-top: 2rem;
`;

type Utfall = 'IKKE_SATT' | 'LAG_BREV' | 'OMGJØR_VEDTAK';

type Props = {
    behandling: Behandling;
};

export const Brev: React.FC<Props> = ({ behandling }: Props) => {
    const behandlingId = behandling.id;

    const [brevRessurs, settBrevRessurs] = useState<Ressurs<string>>(byggTomRessurs());

    const { behandlingErRedigerbar } = useBehandling();

    const { axiosRequest } = useApp();
    const { ferdigstill, senderInn } = useFerdigstillBehandling(
        behandlingId,
        () => lukkModal(),
        (feilmelding) => settFeilmelding(feilmelding)
    );
    const [visModal, settVisModal] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState('');

    const [utfall, settUtfall] = useState<Utfall>('IKKE_SATT');

    const hentVurdering = useCallback(
        (behandlingId: string) => {
            axiosRequest<IVurdering | undefined, null>({
                method: 'GET',
                url: `/familie-klage/api/vurdering/${behandlingId}`,
            }).then((response: RessursSuksess<IVurdering | undefined> | RessursFeilet) => {
                if (response.status === RessursStatus.SUKSESS) {
                    if (response.data?.vedtak === VedtakValg.OMGJØR_VEDTAK) {
                        settUtfall('OMGJØR_VEDTAK');
                    } else {
                        settUtfall('LAG_BREV');
                    }
                } else {
                    settFeilmelding(response.frontendFeilmelding);
                }
            });
        },
        [axiosRequest]
    );

    useEffect(() => {
        hentVurdering(behandlingId);
    }, [behandlingId, hentVurdering]);

    const hentBrev = useCallback(() => {
        axiosRequest<string, null>({
            method: 'GET',
            url: `/familie-klage/api/brev/${behandlingId}/pdf`,
        }).then(settBrevRessurs);
    }, [axiosRequest, behandlingId]);

    const genererBrev = useCallback(() => {
        axiosRequest<string, null>({
            method: 'POST',
            url: `/familie-klage/api/brev/${behandlingId}`,
        }).then((respons: Ressurs<string>) => {
            settBrevRessurs(respons);
        });
    }, [axiosRequest, behandlingId]);

    useEffect(() => {
        if (utfall === 'LAG_BREV') {
            if (behandlingErRedigerbar) {
                genererBrev();
            } else {
                hentBrev();
            }
        }
    }, [behandlingErRedigerbar, genererBrev, hentBrev, utfall]);

    const lukkModal = () => {
        settVisModal(false);
        settFeilmelding('');
    };

    if (utfall === 'LAG_BREV') {
        return (
            <Brevside>
                <HGrid gap={'6'} columns={{ xl: 1, '2xl': '1fr 1.2fr' }}>
                    <VStack gap={'6'}>
                        {brevRessurs.status === RessursStatus.SUKSESS &&
                        behandling.fagsystem !== Fagsystem.EF ? (
                            <BaksBrevmottakerContainer behandlingId={behandling.id} />
                        ) : (
                            <BrevMottakere behandlingId={behandling.id} />
                        )}
                        {behandlingErRedigerbar && brevRessurs.status === RessursStatus.SUKSESS && (
                            <Button
                                variant={'primary'}
                                size={'medium'}
                                onClick={() => settVisModal(true)}
                            >
                                Ferdigstill behandling og send brev
                            </Button>
                        )}
                    </VStack>
                    <PdfVisning pdfFilInnhold={brevRessurs} />
                </HGrid>
                <ModalWrapper
                    tittel={'Bekreft utsending av brev'}
                    visModal={visModal}
                    onClose={() => lukkModal()}
                    aksjonsknapper={{
                        hovedKnapp: {
                            onClick: () => ferdigstill(),
                            tekst: 'Send brev',
                            disabled: senderInn,
                        },
                        lukkKnapp: { onClick: () => lukkModal(), tekst: 'Avbryt' },
                        marginTop: 4,
                    }}
                    ariaLabel={'Bekreft ustending av frittstående brev'}
                >
                    {feilmelding && (
                        <AlertStripe variant={'error'}>Utsending feilet.{feilmelding}</AlertStripe>
                    )}
                </ModalWrapper>
            </Brevside>
        );
    } else if (utfall === 'OMGJØR_VEDTAK') {
        return <OmgjørVedtak behandlingId={behandlingId} />;
    } else {
        return <div>{feilmelding || <SystemetLaster />}</div>;
    }
};
