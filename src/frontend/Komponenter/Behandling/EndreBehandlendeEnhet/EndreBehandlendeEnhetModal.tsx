import { Button, Fieldset, Modal } from '@navikt/ds-react';
import React, { useState } from 'react';
import { useEndreBehandlendeEnhet } from './useEndreBehandlendeEnhet';
import { Behandling } from '../../../App/typer/fagsak';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { FormProvider, useForm } from 'react-hook-form';
import { EndreBehandlendeEnhetFeltnavn } from './feltnavn';
import { EnhetsnummerFelt } from './EnhetsnummerFelt';
import { BegrunnelseFelt } from './BegrunnelseFelt';

export interface EndreBehandlendeEnhetFormValues {
    [EndreBehandlendeEnhetFeltnavn.ENHETSNUMMER]: string;
    [EndreBehandlendeEnhetFeltnavn.BEGRUNNELSE]: string;
}

interface Props {
    behandling: Behandling;
}

export function EndreBehandlendeEnhetModal({ behandling }: Props) {
    const [onSubmitFeilmelding, settOnSubmitFeilmelding] = useState<string>('');
    const { endreBehandlendeEnhet } = useEndreBehandlendeEnhet();
    const { behandlingErRedigerbar, visEndreBehandlendeEnhet, settVisEndreBehandlendeEnhet } =
        useBehandling();

    const form = useForm<EndreBehandlendeEnhetFormValues>({
        mode: 'onChange',
        values: {
            [EndreBehandlendeEnhetFeltnavn.ENHETSNUMMER]: behandling.behandlendeEnhet,
            [EndreBehandlendeEnhetFeltnavn.BEGRUNNELSE]: '',
        },
    });

    const {
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = form;

    async function onSubmit(formValues: EndreBehandlendeEnhetFormValues): Promise<void> {
        settOnSubmitFeilmelding('');
        const { enhetsnummer, begrunnelse } = formValues;
        return endreBehandlendeEnhet(behandling.id, enhetsnummer, begrunnelse)
            .then(() => settVisEndreBehandlendeEnhet(false))
            .catch((error) => settOnSubmitFeilmelding(error.message));
    }

    function lukkModal() {
        settVisEndreBehandlendeEnhet(false);
        settOnSubmitFeilmelding('');
        reset();
    }

    return (
        <Modal
            onClose={lukkModal}
            width={'35rem'}
            header={{
                heading: 'Endre enhet for denne behandlingen',
            }}
            open={visEndreBehandlendeEnhet}
        >
            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <Fieldset
                            error={onSubmitFeilmelding}
                            legend={'Endre enhet'}
                            hideLegend={true}
                        >
                            <EnhetsnummerFelt
                                behandling={behandling}
                                lesevisning={!behandlingErRedigerbar}
                            />
                            <BegrunnelseFelt lesevisning={!behandlingErRedigerbar} />
                        </Fieldset>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant={'primary'}
                            type={'submit'}
                            disabled={isSubmitting || !behandlingErRedigerbar}
                            loading={isSubmitting}
                        >
                            Bekreft
                        </Button>
                        <Button variant={'secondary'} onClick={lukkModal} disabled={isSubmitting}>
                            Avbryt
                        </Button>
                    </Modal.Footer>
                </form>
            </FormProvider>
        </Modal>
    );
}
