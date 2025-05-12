import React, { FC, useState } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { Behandling } from '../../../App/typer/fagsak';
import { useApp } from '../../../App/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { EToast } from '../../../App/typer/toast';
import { Henlagtårsak } from './Henlagtårsak';
import styled from 'styled-components';
import { Alert, Radio, RadioGroup, VStack } from '@navikt/ds-react';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { Stack, Link } from '@navikt/ds-react';
import { ABorderSubtle } from '@navikt/ds-tokens/dist/tokens';
import { base64toBlob, åpnePdfIEgenTab } from '../../../App/utils/utils';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import { erEtterDagensDato } from '../../../App/utils/dato';

const AlertStripe = styled(Alert)`
    margin-top: 1rem;
`;

const HorizontalDivider = styled.div`
    border-bottom: 2px solid ${ABorderSubtle};
`;

export const HenleggModalGammel: FC<{
    behandling: Behandling;
    personopplysninger: IPersonopplysninger;
}> = ({ behandling, personopplysninger }) => {
    const { visHenleggModal, settVisHenleggModal, hentBehandling, hentBehandlingshistorikk } =
        useBehandling();
    const fullmakter = personopplysninger.fullmakt;
    const vergemål = personopplysninger.vergemål;
    const { axiosRequest, settToast } = useApp();
    const navigate = useNavigate();
    const [henlagtårsak, settHenlagtårsak] = useState<Henlagtårsak>();
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

        axiosRequest<string, { årsak: Henlagtårsak; skalSendeHenleggelsesbrev: boolean }>({
            method: 'POST',
            url: `/familie-klage/api/behandling/${behandling.id}/henlegg`,
            data: {
                årsak: henlagtårsak as Henlagtårsak,
                skalSendeHenleggelsesbrev: harValgtSendBrevOgSkalViseFramValg,
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
    const tilknyttetFullmakt = fullmakter.some(
        (fullmakt) => fullmakt.gyldigTilOgMed === null || erEtterDagensDato(fullmakt.gyldigTilOgMed)
    );
    const henlagtårsakTrukketTilbake = henlagtårsak === Henlagtårsak.TRUKKET_TILBAKE;

    const harVergemål = vergemål.length > 0;

    const skalViseTilleggsvalg = !harVergemål && !tilknyttetFullmakt && henlagtårsakTrukketTilbake;

    const harValgtSendBrevOgSkalViseFramValg = harHuketAvSendBrev && skalViseTilleggsvalg;

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
                <RadioGroup legend={''} onChange={(årsak: Henlagtårsak) => settHenlagtårsak(årsak)}>
                    <Radio value={Henlagtårsak.TRUKKET_TILBAKE}>Trukket tilbake</Radio>
                    <Radio value={Henlagtårsak.FEILREGISTRERT}>Feilregistrert</Radio>
                </RadioGroup>
                {skalViseTilleggsvalg && (
                    <>
                        <HorizontalDivider />
                        <RadioGroup
                            legend="Send brev om trukket klage"
                            value={harHuketAvSendBrev}
                            onChange={(harHuketAvSendBrev: boolean) =>
                                settHarHuketAvSendBrev(harHuketAvSendBrev)
                            }
                        >
                            <Stack gap="0 6" direction={{ xs: 'column', sm: 'row' }} wrap={false}>
                                <Radio value={true}>Ja</Radio>
                                <Radio value={false}>Nei</Radio>
                            </Stack>
                        </RadioGroup>
                        <Link onClick={visBrevINyFane} href="#">
                            Forhåndsvis brev
                        </Link>
                    </>
                )}
                {feilmelding && <AlertStripe variant={'error'}>{feilmelding}</AlertStripe>}
                {harVergemål && henlagtårsakTrukketTilbake && (
                    <AlertStripe size={'small'} variant={'warning'}>
                        {'Verge registrert på bruker. Brev om trukket klage må sendes manuelt.'}
                    </AlertStripe>
                )}
                {tilknyttetFullmakt && henlagtårsakTrukketTilbake && (
                    <AlertStripe size={'small'} variant={'warning'}>
                        {'Fullmakt registrert på bruker. Brev om trukket klage må sendes manuelt.'}
                    </AlertStripe>
                )}
            </VStack>
        </ModalWrapper>
    );
};
