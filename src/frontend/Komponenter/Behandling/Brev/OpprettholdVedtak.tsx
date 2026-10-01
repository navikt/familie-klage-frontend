import { Alert, Box, HGrid, VStack } from '@navikt/ds-react';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useApp } from '../../../App/context/AppContext';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { BehandlingStatus } from '../../../App/typer/behandlingstatus';
import { Fagsystem, StegType } from '../../../App/typer/fagsak';
import type { Ressurs } from '../../../App/typer/ressurs';
import { byggTomRessurs, RessursStatus } from '../../../App/typer/ressurs';
import { Button } from '../../../Felles/Knapper/Button';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { BrevmottakerContainer as BrevmottakereBaks } from '../Brevmottakere/baks/BrevmottakerContainer';
import { BrevMottakere as BrevmottakereEf } from '../Brevmottakere/ef/BrevMottakere';
import { PdfVisning } from './PdfVisning';
import { useFerdigstillBehandling } from './useFerdigstillBehandling';

interface Props {
    behandlingId: string;
    fagsystem: Fagsystem;
}

export const OpprettholdVedtak: React.FC<Props> = ({ behandlingId, fagsystem }) => {
    const { behandling, behandlingErRedigerbar } = useBehandling();
    const { axiosRequest } = useApp();

    const erSattPåVent =
        behandling.status === RessursStatus.SUKSESS && behandling.data.status === BehandlingStatus.SATT_PÅ_VENT;
    // Pdf-en lagres først ved ferdigstilling, så i brev-steget finnes den ikke ennå
    const erIBrevSteg = behandling.status === RessursStatus.SUKSESS && behandling.data.steg === StegType.BREV;

    const { ferdigstill, senderInn } = useFerdigstillBehandling(
        behandlingId,
        () => lukkModal(),
        feilmelding => settFeilmelding(feilmelding)
    );

    const [brevRessurs, settBrevRessurs] = useState<Ressurs<string>>(byggTomRessurs());
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
        if (erSattPåVent) {
            settBrevRessurs(byggTomRessurs());
            return;
        }
        if (behandlingErRedigerbar) {
            genererBrev();
        } else if (!erIBrevSteg) {
            hentBrev();
        }
    }, [behandlingErRedigerbar, erSattPåVent, erIBrevSteg, genererBrev, hentBrev]);

    const lukkModal = () => {
        settVisModal(false);
        settFeilmelding('');
    };

    return (
        <Box margin="space-32">
            <HGrid gap={'space-24'} columns={{ xl: 1, '2xl': '1fr 1.2fr' }}>
                <VStack gap={'space-24'}>
                    {brevRessurs.status === RessursStatus.SUKSESS &&
                        (fagsystem === Fagsystem.EF ? (
                            <BrevmottakereEf behandlingId={behandlingId} genererBrev={genererBrev} />
                        ) : (
                            <BrevmottakereBaks behandlingId={behandlingId} />
                        ))}
                    {behandlingErRedigerbar && brevRessurs.status === RessursStatus.SUKSESS && (
                        <Button variant={'primary'} size={'medium'} onClick={() => settVisModal(true)}>
                            Ferdigstill behandling og send brev
                        </Button>
                    )}
                </VStack>
                {erSattPåVent ? (
                    <Alert variant={'info'}>Brevet kan vises når behandlingen tas av vent.</Alert>
                ) : (
                    <PdfVisning pdfFilInnhold={brevRessurs} />
                )}
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
                width={'30rem'}
            >
                {feilmelding && <Alert variant={'error'}>Utsending feilet.{feilmelding}</Alert>}
            </ModalWrapper>
        </Box>
    );
};
