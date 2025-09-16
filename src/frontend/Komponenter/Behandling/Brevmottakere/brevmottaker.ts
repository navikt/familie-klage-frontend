import { MottakerRolle } from './mottakerRolle';
import { IFullmakt, IVergemål } from '../../../App/typer/personopplysninger';
import { BlankEøsLandkode, erEøsLandkode, EøsLandkode } from '../../../Felles/Landvelger/landkode';

export type Brevmottaker = object;

export interface BrevmottakerOrganisasjon extends Brevmottaker {
    organisasjonsnummer: string;
    organisasjonsnavn: string;
    navnHosOrganisasjon: string;
    mottakerRolle?: MottakerRolle;
}

export interface BrevmottakerPerson extends Brevmottaker {
    mottakerRolle: MottakerRolle;
    navn: string;
}

export interface BrevmottakerPersonMedIdent extends BrevmottakerPerson {
    personIdent: string;
}

export function mapTilMottakerRolle(brevmottakere: BrevmottakerPerson[]) {
    return brevmottakere.map((brevmottaker) => brevmottaker.mottakerRolle);
}

export function erBrevmottakerPersonMedIdent(
    brevmottakerPerson: BrevmottakerPerson
): brevmottakerPerson is BrevmottakerPersonMedIdent {
    return (brevmottakerPerson as BrevmottakerPersonMedIdent).personIdent !== undefined;
}

export function mapVergemålTilBrevmottakerPersonMedIdent(
    vergemål: IVergemål
): BrevmottakerPersonMedIdent {
    return {
        navn: vergemål.navn || '',
        personIdent: vergemål.motpartsPersonident || '',
        mottakerRolle: MottakerRolle.VERGE,
    };
}

export function mapFullmaktTilBrevmottakerPersonMedIdent(
    fullmakt: IFullmakt
): BrevmottakerPersonMedIdent {
    return {
        navn: fullmakt.navn || '',
        personIdent: fullmakt.motpartsPersonident,
        mottakerRolle: MottakerRolle.FULLMAKT,
    };
}

export interface BrevmottakerPersonUtenIdent extends BrevmottakerPerson {
    id: string;
    adresselinje1: string;
    adresselinje2?: string;
    postnummer?: string;
    poststed?: string;
    landkode: string;
}

export function erBrevmottakerPersonUtenIdent(
    brevmottakerPerson: BrevmottakerPerson
): brevmottakerPerson is BrevmottakerPersonUtenIdent {
    return (brevmottakerPerson as BrevmottakerPersonUtenIdent).id !== undefined;
}

export function utledBrevmottakerPersonUtenIdentNavnVedDødsbo(
    navn: string,
    landkode: EøsLandkode | BlankEøsLandkode
): string {
    return landkode === EøsLandkode.NO || !erEøsLandkode(landkode)
        ? `${navn} v/dødsbo`
        : `Estate of ${navn}`;
}

export function utledPreutfyltBrevmottakerPersonUtenIdentNavn(
    navnFraPersonopplysninger: string,
    landkode: EøsLandkode | BlankEøsLandkode,
    mottakerRolle: MottakerRolle
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

export function erEnBrevmottakerPersonUtenIdentDødsbo(
    brevmottakere: BrevmottakerPersonUtenIdent[]
) {
    return brevmottakere.some(
        (brevmottaker) => brevmottaker.mottakerRolle === MottakerRolle.DØDSBO
    );
}
