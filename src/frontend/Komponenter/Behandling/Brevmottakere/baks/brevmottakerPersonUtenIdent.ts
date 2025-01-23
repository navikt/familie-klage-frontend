import { BrevmottakerPerson } from '../brevmottakerPerson';
import { EøsLandkode } from '../../../../Felles/Landvelger/landkode';
import { MottakerRolle } from '../mottakerRolle';

export interface BrevmottakerPersonUtenIdent extends BrevmottakerPerson {
    id: string;
    adresselinje1: string;
    adresselinje2?: string;
    postnummer?: string;
    poststed?: string;
    landkode: string;
}

export function utledBrevmottakerPersonUtenIdentNavnVedDødsbo(
    navn: string,
    landkode: string
): string {
    return landkode === EøsLandkode.NO ? `${navn} v/dødsbo` : `Estate of ${navn}`;
}

export function utledPreutfyltBrevmottakerPersonUtenIdentNavn(
    navnFraPersonopplysninger: string,
    landkode: string,
    mottakerRolle: MottakerRolle | string
): string {
    switch (mottakerRolle) {
        case MottakerRolle.DØDSBO:
            return utledBrevmottakerPersonUtenIdentNavnVedDødsbo(
                navnFraPersonopplysninger,
                landkode
            );
        case MottakerRolle.BRUKER_MED_UTENLANDSK_ADRESSE:
            return navnFraPersonopplysninger;
        default:
            throw Error('Unsupported mottaker rolle ' + mottakerRolle);
    }
}

export function erBrevmottakerPersonUtenIdent(
    brevmottakerPerson: BrevmottakerPerson
): brevmottakerPerson is BrevmottakerPersonUtenIdent {
    return (brevmottakerPerson as BrevmottakerPersonUtenIdent).id !== undefined;
}
