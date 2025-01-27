import { MottakerRolle } from './mottakerRolle';
import { IFullmakt, IVergemål } from '../../../App/typer/personopplysninger';
import { EøsLandkode } from '../../../Felles/Landvelger/landkode';

export type Brevmottaker = object;

export interface BrevmottakerOrganisasjon extends Brevmottaker {
    organisasjonsnummer: string;
    organisasjonsnavn: string;
    navnHosOrganisasjon: string;
}

export interface BrevmottakerPerson extends Brevmottaker {
    mottakerRolle: MottakerRolle;
    navn: string;
}

export interface BrevmottakerPersonMedIdent extends BrevmottakerPerson {
    personIdent: string;
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

export function erEnBrevmottakerPersonUtenIdentDødsbo(
    brevmottakere: BrevmottakerPersonUtenIdent[]
) {
    return brevmottakere.some(
        (brevmottaker) => brevmottaker.mottakerRolle === MottakerRolle.DØDSBO
    );
}

export function utledGyldigeMottakerRolleForBrevmottakerPersonUtenIdent(
    brevmottakere: BrevmottakerPersonUtenIdent[]
): MottakerRolle[] {
    const valgteBrevmottakerRoller = brevmottakere.map(
        (brevmottaker) => brevmottaker.mottakerRolle
    );

    if (valgteBrevmottakerRoller.includes(MottakerRolle.DØDSBO)) {
        return [];
    }

    if (valgteBrevmottakerRoller.includes(MottakerRolle.BRUKER_MED_UTENLANDSK_ADRESSE)) {
        return [MottakerRolle.VERGE, MottakerRolle.FULLMAKT];
    }

    if (
        valgteBrevmottakerRoller.length > 0 &&
        !valgteBrevmottakerRoller.includes(MottakerRolle.BRUKER_MED_UTENLANDSK_ADRESSE)
    ) {
        return [MottakerRolle.BRUKER_MED_UTENLANDSK_ADRESSE];
    }

    return Object.values(MottakerRolle)
        .filter((mottakerRolle) => mottakerRolle !== MottakerRolle.BRUKER)
        .filter((mottakerRolle) => !valgteBrevmottakerRoller.includes(mottakerRolle));
}
