import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Behandling } from '../../../../App/typer/fagsak';
import { useBrevmottakereContext } from '../context/BrevmottakereContextProvider';
import {
    HENLEGG_BEHANDLING_MODAL_WIDTHS,
    useHenleggBehandlingModalContext,
} from '../context/HenleggBehandlingModalContextProvider';
import { lagHenleggBehandlingDto } from '../domain/henleggBehandlingDto';
import type { HenleggBehandlingFormValues } from '../HenleggBehandlingForm';
import {
    HenleggBehandlingFeltnavn,
    HenleggBehandlingFormServerErrors,
} from '../HenleggBehandlingForm';
import { useHenleggBehandling } from './useHenleggBehandling';

export function useHenleggBehandlingForm(behandling: Behandling) {
    const { lukkModal } = useHenleggBehandlingModalContext();
    const { brevmottakere } = useBrevmottakereContext();
    const henleggBhandling = useHenleggBehandling();

    const form = useForm<HenleggBehandlingFormValues>({
        shouldUnregister: true,
        defaultValues: {
            [HenleggBehandlingFeltnavn.HENLAGT_ÅRSAK]: null,
            [HenleggBehandlingFeltnavn.SEND_BREV_OM_TRUKKET_KLAGE]: null,
        },
    });

    async function submitForm(values: HenleggBehandlingFormValues): Promise<Awaited<void>> {
        const henleggBehandlingDto = lagHenleggBehandlingDto(values, brevmottakere);
        return henleggBhandling(behandling.id, henleggBehandlingDto)
            .then(() => lukkModal())
            .catch((error: Error) =>
                form.setError(HenleggBehandlingFormServerErrors.onSubmitError.id, {
                    message: error.message,
                })
            );
    }

    const { settModalWidth } = useHenleggBehandlingModalContext();
    const [erBrevmottakerFormSynlig, settErBrevmottakerFormSynlig] = useState<boolean>(false);

    function visBrevmottakerForm() {
        settErBrevmottakerFormSynlig(true);
        settModalWidth(HENLEGG_BEHANDLING_MODAL_WIDTHS.UTVIDET);
    }

    function skjulBrevmottakerForm() {
        settErBrevmottakerFormSynlig(false);
        settModalWidth(HENLEGG_BEHANDLING_MODAL_WIDTHS.DEFAULT);
    }

    return {
        form,
        actions: { submitForm, visBrevmottakerForm, skjulBrevmottakerForm },
        metadata: { erBrevmottakerFormSynlig },
    };
}
