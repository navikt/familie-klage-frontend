import {
    HenleggBehandlingFeltnavn,
    HenleggBehandlingFormServerErrors,
    HenleggBehandlingFormValues,
} from '../HenleggBehandlingForm';
import { lagHenleggBehandlingDto } from '../domain/henleggBehandlingDto';
import { useHenleggBehandling } from './useHenleggBehandling';
import { Behandling } from '../../../../App/typer/fagsak';
import { useHenleggBehandlingModalContext } from '../context/HenleggBehandlingModalContextProvider';
import { useForm } from 'react-hook-form';

export function useHenleggBehandlingForm(behandling: Behandling) {
    const { lukkHenleggBehandlingModal } = useHenleggBehandlingModalContext();
    const henleggBhandling = useHenleggBehandling();

    const henleggBehandlingForm = useForm<HenleggBehandlingFormValues>({
        shouldUnregister: true,
        defaultValues: {
            [HenleggBehandlingFeltnavn.HENLAGT_ÅRSAK]: null,
            [HenleggBehandlingFeltnavn.SEND_BREV_OM_TRUKKET_KLAGE]: null,
        },
    });

    async function onSubmitHenleggBehandlingForm(
        values: HenleggBehandlingFormValues
    ): Promise<Awaited<void>> {
        const henleggBehandlingDto = lagHenleggBehandlingDto(values);
        return henleggBhandling(behandling.id, henleggBehandlingDto)
            .then(() => lukkHenleggBehandlingModal())
            .catch((error: Error) =>
                henleggBehandlingForm.setError(HenleggBehandlingFormServerErrors.onSubmitError.id, {
                    message: error.message,
                })
            );
    }

    return { henleggBehandlingForm, onSubmitHenleggBehandlingForm };
}
