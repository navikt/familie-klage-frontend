import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { EøsLandkode } from '../../../../Felles/Landvelger/landkode';
import {
    BrevmottakerPersonUtenIdentFeltnavn,
    BrevmottakerPersonUtenIdentFormValues,
} from '../../Brevmottakere/baks/modal/form/BrevmottakerPersonUtenIdentForm';
import { lagNyBrevmottakerPersonUtenIdent } from '../../Brevmottakere/nyBrevmottaker';
import { useBrevmottakereContext } from '../context/BrevmottakereContextProvider';
import {
    HENLEGG_BEHANDLING_MODAL_WIDTHS,
    useHenleggBehandlingModalContext,
} from '../context/HenleggBehandlingModalContextProvider';

export function useBrevmottakerForm() {
    const { settModalWidth } = useHenleggBehandlingModalContext();
    const { leggTilBrevmottaker } = useBrevmottakereContext();

    const [erFormSynlig, settErFormSynlig] = useState<boolean>(false);

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
        skjulForm();
    }

    function visForm() {
        settErFormSynlig(true);
        settModalWidth(HENLEGG_BEHANDLING_MODAL_WIDTHS.UTVIDET);
    }

    function skjulForm() {
        settErFormSynlig(false);
        settModalWidth(HENLEGG_BEHANDLING_MODAL_WIDTHS.DEFAULT);
    }

    return { form, actions: { submitForm, visForm, skjulForm }, metadata: { erFormSynlig } };
}
