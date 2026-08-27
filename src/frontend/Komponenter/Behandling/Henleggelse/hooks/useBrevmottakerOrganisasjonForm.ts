import { useForm } from 'react-hook-form';
import type { BrevmottakerOrganisasjonFormValues } from '../../Brevmottakere/baks/modal/OrganisasjonForm/BrevmottakerOrganisasjonForm';
import { BrevmottakerOrganisasjonFeltnavn } from '../../Brevmottakere/baks/modal/OrganisasjonForm/BrevmottakerOrganisasjonForm';
import { lagNyBrevmottakerOrganisasjon } from '../../Brevmottakere/nyBrevmottaker';
import { useBrevmottakereContext } from '../context/BrevmottakereContextProvider';

export function useBrevmottakerOrganisasjonForm(onSubmitCallback?: () => void) {
    const { leggTilBrevmottaker } = useBrevmottakereContext();

    const form = useForm<BrevmottakerOrganisasjonFormValues>({
        defaultValues: {
            [BrevmottakerOrganisasjonFeltnavn.MOTTAKERROLLE]: '',
            [BrevmottakerOrganisasjonFeltnavn.ORGANISASJONSNUMMER]: '',
            [BrevmottakerOrganisasjonFeltnavn.ORGANISASJONSNAVN]: '',
            [BrevmottakerOrganisasjonFeltnavn.NAVN_HOS_ORGANISASJON]: '',
        },
    });

    function submitForm(brevmottakerFormValues: BrevmottakerOrganisasjonFormValues) {
        const nyBrevmottaker = lagNyBrevmottakerOrganisasjon(brevmottakerFormValues);
        leggTilBrevmottaker(nyBrevmottaker);
        onSubmitCallback && onSubmitCallback();
    }

    return { form, actions: { submitForm } };
}
