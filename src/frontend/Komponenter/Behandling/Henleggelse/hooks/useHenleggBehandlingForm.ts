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
import { useBrevmottakereContext } from '../context/BrevmottakereContextProvider';

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

    return { form, actions: { submitForm } };
}
