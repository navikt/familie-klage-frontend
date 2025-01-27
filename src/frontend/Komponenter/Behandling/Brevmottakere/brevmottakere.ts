import { BrevmottakerPerson } from './brevmottakerPerson';
import { BrevmottakerOrganisasjon } from './brevmottakerOrganisasjon';

export interface Brevmottakere {
    personer: BrevmottakerPerson[];
    organisasjoner: BrevmottakerOrganisasjon[];
}
