import { Button, Fieldset, Modal, Select, Textarea } from '@navikt/ds-react';
import React from 'react';
import useEndreBehandlendeEnhet from './useEndreBehandlendeEnhet';
import { RessursStatus } from '../../../App/typer/ressurs';
import { IArbeidsfordelingsenhet } from './behandlendeEnhet';
import { Behandling } from '../../../App/typer/fagsak';
import { useBehandling } from '../../../App/context/BehandlingContext';

interface IProps {
    behandling: Behandling;
}

const EndreBehandlendeEnhetModal: React.FC<IProps> = ({ behandling }: IProps) => {
    const { behandlingErRedigerbar, visEndreBehandlendeEnhet, settVisEndreBehandlendeEnhet } =
        useBehandling();
    const {
        begrunnelse,
        onChangeBegrunnelse,
        enhetsnummer,
        onChangeEnhetsnummer,
        onSubmitEndreEnhet,
        resetEndreBehandlendeEnhetTilstand,
        submitRessurs,
        feilmelding,
        gyldigeEnheterForFagsystem,
    } = useEndreBehandlendeEnhet({
        behandlendeEnhet: behandling.behandlendeEnhet,
        fagsystem: behandling.fagsystem,
        onSuccessCallback: () => settVisEndreBehandlendeEnhet(false),
    });

    const lukkBehandlendeEnhetModal = () => {
        resetEndreBehandlendeEnhetTilstand();
        settVisEndreBehandlendeEnhet(false);
    };

    return (
        <Modal
            onClose={lukkBehandlendeEnhetModal}
            width={'35rem'}
            header={{
                heading: 'Endre enhet for denne behandlingen',
            }}
            open={visEndreBehandlendeEnhet}
        >
            <Modal.Body>
                <Fieldset error={feilmelding} legend="Endre enhet" hideLegend>
                    <Select
                        label={'Velg ny enhet'}
                        value={enhetsnummer}
                        onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
                            onChangeEnhetsnummer(event.target.value);
                        }}
                    >
                        {gyldigeEnheterForFagsystem.map((enhet: IArbeidsfordelingsenhet) => {
                            return (
                                <option key={enhet.enhetsnummer} value={enhet.enhetsnummer}>
                                    {`${enhet.enhetsnummer} ${enhet.enhetsnavn}`}
                                </option>
                            );
                        })}
                    </Select>

                    <Textarea
                        label={'Begrunnelse'}
                        value={begrunnelse}
                        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                            onChangeBegrunnelse(event.target.value);
                        }}
                        maxLength={4000}
                        readOnly={!behandlingErRedigerbar}
                        disabled={submitRessurs.status === RessursStatus.HENTER}
                    />
                </Fieldset>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="primary"
                    disabled={submitRessurs.status === RessursStatus.HENTER}
                    onClick={() => {
                        onSubmitEndreEnhet(behandling.id);
                    }}
                    loading={submitRessurs.status === RessursStatus.HENTER}
                >
                    Bekreft
                </Button>
                <Button variant="secondary" onClick={lukkBehandlendeEnhetModal}>
                    Avbryt
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EndreBehandlendeEnhetModal;
