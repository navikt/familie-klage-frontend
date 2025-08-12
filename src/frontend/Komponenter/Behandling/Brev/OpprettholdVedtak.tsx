import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Box, HGrid, VStack } from '@navikt/ds-react';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { Fagsystem } from '../../../App/typer/fagsak';
import { BrevmottakerContainer as BaksBrevmottakerContainer } from '../Brevmottakere/baks/BrevmottakerContainer';
import { BrevMottakere } from '../Brevmottakere/ef/BrevMottakere';
import { PdfVisning } from './PdfVisning';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { useApp } from '../../../App/context/AppContext';
import { useFerdigstillBehandling } from './useFerdigstillBehandling';
import { IVurdering, VedtakValg } from '../Vurdering/vurderingValg';
import { Button } from '../../../Felles/Knapper/Button';

interface Props {
    behandlingId: string;
    fagsystem: Fagsystem;
    vurdering: IVurdering;
}

export const OpprettholdVedtak: React.FC<Props> = ({ behandlingId, fagsystem, vurdering }) => {
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
        if (vurdering.vedtak === VedtakValg.OPPRETTHOLD_VEDTAK) {
            if (behandlingErRedigerbar) {
                genererBrev();
            } else {
                hentBrev();
            }
        }
    }, [behandlingErRedigerbar, genererBrev, hentBrev, vurdering.vedtak]);

    const lukkModal = () => {
        settVisModal(false);
        settFeilmelding('');
    };

    return (
        <Box margin="8">
            <HGrid gap={'6'} columns={{ xl: 1, '2xl': '1fr 1.2fr' }}>
                <VStack gap={'6'}>
                    {brevRessurs.status === RessursStatus.SUKSESS &&
                        (fagsystem === Fagsystem.EF ? (
                            <BrevMottakere behandlingId={behandlingId} />
                        ) : (
                            <BaksBrevmottakerContainer behandlingId={behandlingId} />
                        ))}
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
                }}
                ariaLabel={'Bekreft ustending av frittstående brev'}
            >
                {feilmelding && <Alert variant={'error'}>Utsending feilet.{feilmelding}</Alert>}
            </ModalWrapper>
        </Box>
    );
};
