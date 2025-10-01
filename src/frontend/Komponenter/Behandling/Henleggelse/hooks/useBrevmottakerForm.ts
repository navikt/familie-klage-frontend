import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { EøsLandkode } from '../../../../Felles/Landvelger/landkode';
import {
    BrevmottakerFeltnavn,
    BrevmottakerFormValues,
} from '../../Brevmottakere/baks/modal/form/BrevmottakerForm';
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

    const form = useForm<BrevmottakerFormValues>({
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

    function submitForm(values: BrevmottakerFormValues) {
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
