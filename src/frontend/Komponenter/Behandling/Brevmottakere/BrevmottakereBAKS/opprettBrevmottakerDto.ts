import { Brevmottaker } from './brevmottaker';
import { BrevmottakerFormValues } from './modal/form/BrevmottakerForm';
import { EøsLandkode } from '../../../../Felles/Landvelger/landkode';

export type OpprettBrevmottakerDto = Omit<Brevmottaker, 'id'>;

export function lagOpprettBrevmottakerDto(
    brevmottakerFormValues: BrevmottakerFormValues
): OpprettBrevmottakerDto {
    if (brevmottakerFormValues.mottakertype === '') {
        throw Error('Ugyldig tilstand. Mottakertype er påkrevd.');
    }
    const erNorgeValgt = brevmottakerFormValues.landkode === EøsLandkode.NO;
    return {
        mottakertype: brevmottakerFormValues.mottakertype,
        navn: brevmottakerFormValues.navn,
        landkode: brevmottakerFormValues.landkode,
        adresselinje1: brevmottakerFormValues.adresselinje1,
        adresselinje2: brevmottakerFormValues.adresselinje2,
        postnummer: erNorgeValgt ? brevmottakerFormValues.postnummer : null,
        poststed: erNorgeValgt ? brevmottakerFormValues.poststed : null,
    };
}
