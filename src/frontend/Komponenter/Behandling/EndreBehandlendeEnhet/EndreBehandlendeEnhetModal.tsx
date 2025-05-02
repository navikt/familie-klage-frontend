import { Button, Fieldset, Modal } from '@navikt/ds-react';
import React from 'react';
import { useEndreBehandlendeEnhet } from './useEndreBehandlendeEnhet';
import { Behandling } from '../../../App/typer/fagsak';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { EndreBehandlendeEnhetFeltnavn } from './feltnavn';
import { EnhetsnummerFelt } from './EnhetsnummerFelt';
import { BegrunnelseFelt } from './BegrunnelseFelt';

export const CustomFormErrors: Record<
    'onSubmitError',
    {
        id: `root.${string}`;
        lookup: (errors: FieldErrors<EndreBehandlendeEnhetFormValues>) => string | undefined;
    }
> = {
    onSubmitError: {
        id: 'root.onSubmitError',
        lookup: (errors) => errors?.root?.onSubmitError.message,
    },
};

export interface EndreBehandlendeEnhetFormValues {
    [EndreBehandlendeEnhetFeltnavn.ENHETSNUMMER]: string;
    [EndreBehandlendeEnhetFeltnavn.BEGRUNNELSE]: string;
}

interface Props {
    behandling: Behandling;
}

export function EndreBehandlendeEnhetModal({ behandling }: Props) {
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
        formState: { isSubmitting, errors },
        setError,
        clearErrors,
    } = form;

    async function onSubmit(formValues: EndreBehandlendeEnhetFormValues): Promise<void> {
        clearErrors(CustomFormErrors.onSubmitError.id);
        const { enhetsnummer, begrunnelse } = formValues;
        return endreBehandlendeEnhet(behandling.id, enhetsnummer, begrunnelse)
            .then(() => settVisEndreBehandlendeEnhet(false))
            .catch((error) =>
                setError(CustomFormErrors.onSubmitError.id, { message: error.message })
            );
    }

    function lukkModal() {
        settVisEndreBehandlendeEnhet(false);
        clearErrors(CustomFormErrors.onSubmitError.id);
        reset();
    }

    return (
        <Modal
            onClose={lukkModal}
            width={'35rem'}
            header={{ heading: 'Endre enhet for denne behandlingen' }}
            open={visEndreBehandlendeEnhet}
        >
            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <Fieldset
                            error={CustomFormErrors.onSubmitError.lookup(errors)}
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
