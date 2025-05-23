import { useForm } from 'react-hook-form';
import { EøsLandkode } from '../../../../Felles/Landvelger/landkode';
import {
    BrevmottakerFeltnavn,
    BrevmottakerFormValues,
} from '../../Brevmottakere/baks/modal/form/BrevmottakerForm';
import { lagNyBrevmottakerPersonUtenIdent } from '../../Brevmottakere/nyBrevmottaker';
import { useBrevmottakereContext } from '../context/BrevmottakereContextProvider';
import { useHenleggBehandlingModalContext } from '../context/HenleggBehandlingModalContextProvider';

export function useBrevmottakerForm() {
    const { lukkHenleggBehandlingModal } = useHenleggBehandlingModalContext();
    const { leggTilBrevmottaker } = useBrevmottakereContext();

    const brevmottakerForm = useForm<BrevmottakerFormValues>({
        shouldUnregister: true,
        defaultValues: {
            [BrevmottakerFeltnavn.MOTTAKERROLLE]: '',
            [BrevmottakerFeltnavn.LANDKODE]: EøsLandkode.NO,
            [BrevmottakerFeltnavn.NAVN]: '',
            [BrevmottakerFeltnavn.ADRESSELINJE1]: '',
            [BrevmottakerFeltnavn.ADRESSELINJE2]: '',
            [BrevmottakerFeltnavn.POSTNUMMER]: '',
            [BrevmottakerFeltnavn.POSTSTED]: '',
        },
    });

    function onSubmitBrevmottakerForm(values: BrevmottakerFormValues) {
        const nyBrevmottaker = lagNyBrevmottakerPersonUtenIdent(values);
        leggTilBrevmottaker(nyBrevmottaker);
        lukkHenleggBehandlingModal();
    }

    return { brevmottakerForm, onSubmitBrevmottakerForm };
}
