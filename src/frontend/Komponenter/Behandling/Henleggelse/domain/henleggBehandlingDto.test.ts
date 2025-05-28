import { describe, expect } from 'vitest';
import { lagHenleggBehandlingDto } from './henleggBehandlingDto';
import { HenleggBehandlingFeltnavn, HenleggBehandlingFormValues } from '../HenleggBehandlingForm';
import {
    NyBrevmottakerPerson,
    NyBrevmottakerPersonMedIdent,
    NyBrevmottakerType,
} from '../../Brevmottakere/nyBrevmottaker';
import { HenlagtÅrsak } from './henlagtÅrsak';
import { MottakerRolle } from '../../Brevmottakere/mottakerRolle';

describe('LagHenleggBehandlingDto', () => {
    const bruker = {
        type: NyBrevmottakerType.PERSON_MED_IDENT,
        personIdent: '12345678903',
        mottakerRolle: MottakerRolle.BRUKER,
        navn: 'Navn Navnesen',
    } as NyBrevmottakerPersonMedIdent;

    test('skal kaste error når henlagt årsak er null', () => {
        // Arrange
        const values: HenleggBehandlingFormValues = {
            [HenleggBehandlingFeltnavn.HENLAGT_ÅRSAK]: null,
            [HenleggBehandlingFeltnavn.SEND_BREV_OM_TRUKKET_KLAGE]: null,
        };

        const nyeBrevmottakere: NyBrevmottakerPerson[] = [];

        // Act & expect
        expect(() => lagHenleggBehandlingDto(values, nyeBrevmottakere)).toThrowError(
            'Forventer ikke at henlagt årsak er null her.'
        );
    });

    test('skal lage dto uten brevmottakere om sendBrevOmTrukketKlage er false', () => {
        // Arrange
        const values: HenleggBehandlingFormValues = {
            [HenleggBehandlingFeltnavn.HENLAGT_ÅRSAK]: HenlagtÅrsak.TRUKKET_TILBAKE,
            [HenleggBehandlingFeltnavn.SEND_BREV_OM_TRUKKET_KLAGE]: false,
        };

        const nyeBrevmottakere: NyBrevmottakerPerson[] = [bruker];

        // Act
        const dto = lagHenleggBehandlingDto(values, nyeBrevmottakere);

        // Expect
        expect(dto.årsak).toEqual(HenlagtÅrsak.TRUKKET_TILBAKE);
        expect(dto.skalSendeHenleggelsesbrev).toEqual(false);
        expect(dto.nyeBrevmottakere.length).toEqual(0);
    });

    test('skal lage dto uten brevmottakere om sendBrevOmTrukketKlage er null', () => {
        // Arrange
        const values: HenleggBehandlingFormValues = {
            [HenleggBehandlingFeltnavn.HENLAGT_ÅRSAK]: HenlagtÅrsak.FEILREGISTRERT,
            [HenleggBehandlingFeltnavn.SEND_BREV_OM_TRUKKET_KLAGE]: null,
        };

        const nyeBrevmottakere: NyBrevmottakerPerson[] = [bruker];

        // Act
        const dto = lagHenleggBehandlingDto(values, nyeBrevmottakere);

        // Expect
        expect(dto.årsak).toEqual(HenlagtÅrsak.FEILREGISTRERT);
        expect(dto.skalSendeHenleggelsesbrev).toEqual(false);
        expect(dto.nyeBrevmottakere.length).toEqual(0);
    });

    test('skal lage dto med brevmottakere om sendBrevOmTrukketKlage er true', () => {
        // Arrange
        const values: HenleggBehandlingFormValues = {
            [HenleggBehandlingFeltnavn.HENLAGT_ÅRSAK]: HenlagtÅrsak.TRUKKET_TILBAKE,
            [HenleggBehandlingFeltnavn.SEND_BREV_OM_TRUKKET_KLAGE]: true,
        };

        const nyeBrevmottakere: NyBrevmottakerPerson[] = [bruker];

        // Act
        const dto = lagHenleggBehandlingDto(values, nyeBrevmottakere);

        // Expect
        expect(dto.årsak).toEqual(HenlagtÅrsak.TRUKKET_TILBAKE);
        expect(dto.skalSendeHenleggelsesbrev).toEqual(true);
        expect(dto.nyeBrevmottakere.at(0)).toEqual(bruker);
    });
});
