import { HenlagtÅrsak } from './henlagtÅrsak';
import { HenleggBehandlingFormValues } from '../HenleggBehandlingForm';

export interface HenleggBehandlingDto {
    årsak: HenlagtÅrsak;
    skalSendeHenleggelsesbrev: boolean;
}

export function lagHenleggBehandlingDto(values: HenleggBehandlingFormValues): HenleggBehandlingDto {
    const { henlagtÅrsak, sendBrevOmTrukketKlage } = values;
    if (henlagtÅrsak === null) {
        throw Error('Forventer ikke at henlagt årsak er null her.');
    }
    return {
        årsak: henlagtÅrsak,
        skalSendeHenleggelsesbrev: sendBrevOmTrukketKlage ?? false,
    };
}
