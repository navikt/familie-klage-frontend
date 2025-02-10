import React, { FC, useState } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { Behandling } from '../../../App/typer/fagsak';
import { useApp } from '../../../App/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { EToast } from '../../../App/typer/toast';
import { EHenlagtårsak } from './EHenlagtÅrsak';
import styled from 'styled-components';
import { Alert, Radio, RadioGroup, VStack } from '@navikt/ds-react';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { Stack, Link } from '@navikt/ds-react';
import { ABorderSubtle } from '@navikt/ds-tokens/dist/tokens';
import { base64toBlob, åpnePdfIEgenTab } from '../../../App/utils/utils';

const AlertStripe = styled(Alert)`
    margin-top: 1rem;
`;

const HorizontalDivider = styled.div`
    border-bottom: 2px solid ${ABorderSubtle};
`;

export const HenleggModal: FC<{ behandling: Behandling }> = ({ behandling }) => {
    const { visHenleggModal, settVisHenleggModal, hentBehandling, hentBehandlingshistorikk } =
        useBehandling();

    const { axiosRequest, settToast } = useApp();
    const navigate = useNavigate();
    const [henlagtårsak, settHenlagtårsak] = useState<EHenlagtårsak>();
    const [henleggerBehandling, settHenleggerBehandling] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const [harHuketAvSendBrev, settHarHuketAvSendBrev] = useState<boolean>(true);
    const [henterBrev, settHenterBrev] = useState<boolean>(false);

    const henleggBehandling = () => {
        if (henleggerBehandling) {
            return;
        }
        if (!henlagtårsak) {
            settFeilmelding('Du må velge en henleggelsesårsak');
            return;
        }
        settHenleggerBehandling(true);

        axiosRequest<string, { årsak: EHenlagtårsak; skalSendeHenleggelsesbrev: boolean }>({
            method: 'POST',
            url: `/familie-klage/api/behandling/${behandling.id}/henlegg`,
            data: {
                årsak: henlagtårsak as EHenlagtårsak,
                skalSendeHenleggelsesbrev: harHuketAvSendBrev,
            },
        })
            .then((respons: RessursSuksess<string> | RessursFeilet) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    lukkModal();
                    hentBehandling.rerun();
                    hentBehandlingshistorikk.rerun();
                    navigate(`/behandling/${behandling.id}/resultat`);
                    settToast(EToast.BEHANDLING_HENLAGT);
                } else {
                    settFeilmelding(respons.frontendFeilmelding);
                }
            })
            .finally(() => settHenleggerBehandling(false));
    };

    const lukkModal = () => {
        settFeilmelding('');
        settVisHenleggModal(false);
        settHenlagtårsak(undefined);
    };

    const visBrevINyFane = () => {
        if (!henterBrev) {
            settHenterBrev(true);
            axiosRequest<string, null>({
                method: 'GET',
                url: `/familie-klage/api/behandling/${behandling.id}/henlegg/brev/forhandsvisning`,
            }).then((respons: RessursSuksess<string> | RessursFeilet) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    åpnePdfIEgenTab(
                        base64toBlob(respons.data, 'application/pdf'),
                        'Forhåndsvisning av trukket søknadsbrev'
                    );
                } else {
                    settFeilmelding(respons.frontendFeilmelding);
                }
                settHenterBrev(false);
            });
        }
    };

    const skalViseTilleggsvalg = henlagtårsak === EHenlagtårsak.TRUKKET_TILBAKE;

    return (
        <ModalWrapper
            tittel={'Henlegg'}
            visModal={visHenleggModal}
            onClose={() => lukkModal()}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: () => henleggBehandling(),
                    tekst: 'Henlegg',
                    disabled: henleggerBehandling,
                },
                lukkKnapp: { onClick: () => lukkModal(), tekst: 'Avbryt' },
            }}
            ariaLabel={'Velg årsak til henleggelse av behandlingen'}
        >
            <VStack gap="4">
                <RadioGroup
                    legend={''}
                    onChange={(årsak: EHenlagtårsak) => settHenlagtårsak(årsak)}
                >
                    <Radio value={EHenlagtårsak.TRUKKET_TILBAKE}>Trukket tilbake</Radio>
                    <Radio value={EHenlagtårsak.FEILREGISTRERT}>Feilregistrert</Radio>
                </RadioGroup>
                {skalViseTilleggsvalg && (
                    <>
                        <HorizontalDivider />
                        <RadioGroup legend="Send brev om trukket klage" value={harHuketAvSendBrev}>
                            <Stack gap="0 6" direction={{ xs: 'column', sm: 'row' }} wrap={false}>
                                <Radio
                                    value={true}
                                    onChange={() => {
                                        settHarHuketAvSendBrev(true);
                                    }}
                                >
                                    Ja
                                </Radio>
                                <Radio value={false} onChange={() => settHarHuketAvSendBrev(false)}>
                                    Nei
                                </Radio>
                            </Stack>
                        </RadioGroup>
                        <Link onClick={visBrevINyFane} href="#">
                            Forhåndsvis brev
                        </Link>
                    </>
                )}
                {feilmelding && <AlertStripe variant={'error'}>{feilmelding}</AlertStripe>}
            </VStack>
        </ModalWrapper>
    );
};
