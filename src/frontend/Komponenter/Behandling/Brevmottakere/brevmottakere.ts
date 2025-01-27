import { BrevmottakerOrganisasjon, BrevmottakerPerson } from './brevmottaker';

export interface Brevmottakere {
    personer: BrevmottakerPerson[];
    organisasjoner: BrevmottakerOrganisasjon[];
}
