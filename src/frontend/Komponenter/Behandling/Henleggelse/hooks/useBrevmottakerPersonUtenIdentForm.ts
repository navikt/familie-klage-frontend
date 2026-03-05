import { useForm } from 'react-hook-form';
import { EøsLandkode } from '../../../../Felles/Landvelger/landkode';
import {
    BrevmottakerPersonUtenIdentFeltnavn,
    BrevmottakerPersonUtenIdentFormValues,
} from '../../Brevmottakere/baks/modal/form/BrevmottakerPersonUtenIdentForm';
import { lagNyBrevmottakerPersonUtenIdent } from '../../Brevmottakere/nyBrevmottaker';
import { useBrevmottakereContext } from '../context/BrevmottakereContextProvider';

export function useBrevmottakerPersonUtenIdentForm(onSubmitCallback?: () => void) {
    const { leggTilBrevmottaker } = useBrevmottakereContext();

    const form = useForm<BrevmottakerPersonUtenIdentFormValues>({
        defaultValues: {
            [BrevmottakerPersonUtenIdentFeltnavn.MOTTAKERROLLE]: '',
            [BrevmottakerPersonUtenIdentFeltnavn.LANDKODE]: EøsLandkode.NO,
            [BrevmottakerPersonUtenIdentFeltnavn.NAVN]: '',
            [BrevmottakerPersonUtenIdentFeltnavn.ADRESSELINJE1]: '',
            [BrevmottakerPersonUtenIdentFeltnavn.ADRESSELINJE2]: '',
            [BrevmottakerPersonUtenIdentFeltnavn.POSTNUMMER]: '',
            [BrevmottakerPersonUtenIdentFeltnavn.POSTSTED]: '',
        },
    });

    function submitForm(values: BrevmottakerPersonUtenIdentFormValues) {
        const nyBrevmottaker = lagNyBrevmottakerPersonUtenIdent(values);
        leggTilBrevmottaker(nyBrevmottaker);
        onSubmitCallback && onSubmitCallback();
    }

    return { form, actions: { submitForm } };
}
