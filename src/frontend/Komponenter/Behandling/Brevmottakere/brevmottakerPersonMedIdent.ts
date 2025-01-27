import { IFullmakt, IVergemål } from '../../../App/typer/personopplysninger';
import { MottakerRolle } from './mottakerRolle';
import { BrevmottakerPerson } from './brevmottakerPerson';

export interface BrevmottakerPersonMedIdent extends BrevmottakerPerson {
    personIdent: string;
}

export const vergemålTilBrevmottakerPersonMedIdent = (
    vergemål: IVergemål
): BrevmottakerPersonMedIdent => ({
    navn: vergemål.navn || '',
    personIdent: vergemål.motpartsPersonident || '',
    mottakerRolle: MottakerRolle.VERGE,
});

export const fullmaktTilBrevmottakerPersonMedIdent = (
    fullmakt: IFullmakt
): BrevmottakerPersonMedIdent => ({
    navn: fullmakt.navn || '',
    personIdent: fullmakt.motpartsPersonident,
    mottakerRolle: MottakerRolle.FULLMAKT,
});

export function erBrevmottakerPersonMedIdent(
    brevmottakerPerson: BrevmottakerPerson
): brevmottakerPerson is BrevmottakerPersonMedIdent {
    return (brevmottakerPerson as BrevmottakerPersonMedIdent).personIdent !== undefined;
}
