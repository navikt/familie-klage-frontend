import { BrevmottakerFeltnavn } from './brevmottakerFeltnavn';
import { Mottakertype } from '../BrevmottakereBAKS';
import { EøsLandkode } from '../../../../../Felles/Landvelger/landkode';

export type BrevmottakerFormState = {
    [BrevmottakerFeltnavn.MOTTAKERTYPE]: Mottakertype;
    [BrevmottakerFeltnavn.LANDKODE]: EøsLandkode | '';
    [BrevmottakerFeltnavn.NAVN]: string;
    [BrevmottakerFeltnavn.ADRESSELINJE1]: string;
    [BrevmottakerFeltnavn.ADRESSELINJE2]: string;
    [BrevmottakerFeltnavn.POSTNUMMER]: string;
    [BrevmottakerFeltnavn.POSTSTED]: string;
};
