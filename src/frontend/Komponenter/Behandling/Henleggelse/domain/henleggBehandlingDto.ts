import { HenlagtÅrsak } from './henlagtÅrsak';
import { HenleggBehandlingFormValues } from '../HenleggBehandlingForm';
import { NyBrevmottakerPerson } from '../../Brevmottakere/nyBrevmottaker';

export interface HenleggBehandlingDto {
    årsak: HenlagtÅrsak;
    skalSendeHenleggelsesbrev: boolean;
    nyeBrevmottakere: NyBrevmottakerPerson[];
}

export function lagHenleggBehandlingDto(
    values: HenleggBehandlingFormValues,
    nyeBrevmottakere: NyBrevmottakerPerson[]
): HenleggBehandlingDto {
    const { henlagtÅrsak, sendBrevOmTrukketKlage } = values;
    if (henlagtÅrsak === null) {
        throw Error('Forventer ikke at henlagt årsak er null her.');
    }
    return {
        årsak: henlagtÅrsak,
        skalSendeHenleggelsesbrev: !!sendBrevOmTrukketKlage,
        nyeBrevmottakere: sendBrevOmTrukketKlage ? nyeBrevmottakere : [],
    };
}
