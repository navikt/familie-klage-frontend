import { BrevmottakerFormValues } from './modal/form/BrevmottakerForm';
import { EøsLandkode } from '../../../../Felles/Landvelger/landkode';
import { BrevmottakerPersonUtenIdent } from './brevmottakerPersonUtenIdent';

export type NyBrevmottakerPersonUtenIdent = Omit<BrevmottakerPersonUtenIdent, 'id'>;

export function lagNyBrevmottakerPersonUtenIdent(
    brevmottakerFormValues: BrevmottakerFormValues
): NyBrevmottakerPersonUtenIdent {
    if (brevmottakerFormValues.mottakerRolle === '') {
        throw Error('Ugyldig tilstand. Mottaker rolle er påkrevd.');
    }
    const erNorgeValgt = brevmottakerFormValues.landkode === EøsLandkode.NO;
    return {
        mottakerRolle: brevmottakerFormValues.mottakerRolle,
        navn: brevmottakerFormValues.navn,
        landkode: brevmottakerFormValues.landkode,
        adresselinje1: brevmottakerFormValues.adresselinje1,
        adresselinje2: brevmottakerFormValues.adresselinje2,
        postnummer: erNorgeValgt ? brevmottakerFormValues.postnummer : undefined,
        poststed: erNorgeValgt ? brevmottakerFormValues.poststed : undefined,
    };
}
