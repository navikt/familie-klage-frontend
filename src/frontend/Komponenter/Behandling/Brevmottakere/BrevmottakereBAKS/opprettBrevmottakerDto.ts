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
    const erUtenlandskLandkode = brevmottakerFormValues.landkode !== EøsLandkode.NO;
    return {
        mottakertype: brevmottakerFormValues.mottakertype,
        navn: brevmottakerFormValues.navn,
        landkode: brevmottakerFormValues.landkode,
        adresselinje1: brevmottakerFormValues.adresselinje1,
        adresselinje2: brevmottakerFormValues.adresselinje2,
        postnummer: erUtenlandskLandkode ? null : brevmottakerFormValues.postnummer,
        poststed: erUtenlandskLandkode ? null : brevmottakerFormValues.poststed,
    };
}
