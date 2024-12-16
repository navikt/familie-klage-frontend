import { BrevmottakerFeltnavn } from './brevmottakerFeltnavn';
import { Mottaker } from '../BrevmottakereBAKS';
import { EøsLandkode } from '../../../../../Felles/Landvelger/landkode';

export type BrevmottakerFormState = {
    [BrevmottakerFeltnavn.MOTTAKER]: Mottaker;
    [BrevmottakerFeltnavn.LANDKODE]: EøsLandkode | '';
    [BrevmottakerFeltnavn.NAVN]: string;
    [BrevmottakerFeltnavn.ADRESSELINJE1]: string;
    [BrevmottakerFeltnavn.ADRESSELINJE2]: string;
    [BrevmottakerFeltnavn.POSTNUMMER]: string;
    [BrevmottakerFeltnavn.POSTSTED]: string;
};
