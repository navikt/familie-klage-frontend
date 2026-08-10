import type { HenlagtÅrsak } from './henlagtÅrsak';
import type { HenleggBehandlingFormValues } from '../HenleggBehandlingForm';
import type { NyBrevmottaker } from '../../Brevmottakere/nyBrevmottaker';

export interface HenleggBehandlingDto {
    årsak: HenlagtÅrsak;
    skalSendeHenleggelsesbrev: boolean;
    nyeBrevmottakere: NyBrevmottaker[];
}

export function lagHenleggBehandlingDto(
    values: HenleggBehandlingFormValues,
    nyeBrevmottakere: NyBrevmottaker[]
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
