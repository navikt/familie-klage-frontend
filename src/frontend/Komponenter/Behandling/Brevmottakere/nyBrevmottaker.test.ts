import { describe, expect } from 'vitest';
import { lagNyBrevmottakerPersonUtenIdent, NyBrevmottakerType } from './nyBrevmottaker';
import { MottakerRolle } from './mottakerRolle';
import { EøsLandkode } from '../../../Felles/Landvelger/landkode';
import {
    BrevmottakerPersonUtenIdentFeltnavn,
    BrevmottakerPersonUtenIdentFormValues,
} from './baks/modal/form/BrevmottakerPersonUtenIdentForm';

describe('NyBrevmottakerTest', () => {
    describe('LagNyBrevmottakerPersonUtenIdentTest', () => {
        test('skal lage ny brevmottaker person uten ident som kommer fra norge med alle feltene utfylt', () => {
            // Arrange
            const values: BrevmottakerPersonUtenIdentFormValues = {
                [BrevmottakerPersonUtenIdentFeltnavn.MOTTAKERROLLE]: MottakerRolle.FULLMAKT,
                [BrevmottakerPersonUtenIdentFeltnavn.LANDKODE]: EøsLandkode.NO,
                [BrevmottakerPersonUtenIdentFeltnavn.NAVN]: 'Navn Navnensen',
                [BrevmottakerPersonUtenIdentFeltnavn.ADRESSELINJE1]: 'Adresselinje 1',
                [BrevmottakerPersonUtenIdentFeltnavn.ADRESSELINJE2]: 'Adresselinje 2',
                [BrevmottakerPersonUtenIdentFeltnavn.POSTNUMMER]: '0010',
                [BrevmottakerPersonUtenIdentFeltnavn.POSTSTED]: 'Oslo',
            };

            // Act
            const nyBrevmottakerPersonUtenIdent = lagNyBrevmottakerPersonUtenIdent(values);

            // Expect
            expect(nyBrevmottakerPersonUtenIdent.type).toBe(NyBrevmottakerType.PERSON_UTEN_IDENT);
            expect(nyBrevmottakerPersonUtenIdent.mottakerRolle).toBe(
                values[BrevmottakerPersonUtenIdentFeltnavn.MOTTAKERROLLE]
            );
            expect(nyBrevmottakerPersonUtenIdent.landkode).toBe(
                values[BrevmottakerPersonUtenIdentFeltnavn.LANDKODE]
            );
            expect(nyBrevmottakerPersonUtenIdent.navn).toBe(
                values[BrevmottakerPersonUtenIdentFeltnavn.NAVN]
            );
            expect(nyBrevmottakerPersonUtenIdent.adresselinje1).toBe(
                values[BrevmottakerPersonUtenIdentFeltnavn.ADRESSELINJE1]
            );
            expect(nyBrevmottakerPersonUtenIdent.adresselinje2).toBe(
                values[BrevmottakerPersonUtenIdentFeltnavn.ADRESSELINJE2]
            );
            expect(nyBrevmottakerPersonUtenIdent.postnummer).toBe(
                values[BrevmottakerPersonUtenIdentFeltnavn.POSTNUMMER]
            );
            expect(nyBrevmottakerPersonUtenIdent.poststed).toBe(
                values[BrevmottakerPersonUtenIdentFeltnavn.POSTSTED]
            );
        });

        test('skal lage ny brevmottaker person uten ident som kommer fra norge uten alle feltene utfylt', () => {
            // Arrange
            const values: BrevmottakerPersonUtenIdentFormValues = {
                [BrevmottakerPersonUtenIdentFeltnavn.MOTTAKERROLLE]: MottakerRolle.FULLMAKT,
                [BrevmottakerPersonUtenIdentFeltnavn.LANDKODE]: EøsLandkode.NO,
                [BrevmottakerPersonUtenIdentFeltnavn.NAVN]: 'Navn Navnensen',
                [BrevmottakerPersonUtenIdentFeltnavn.ADRESSELINJE1]: 'Adresselinje 1',
                [BrevmottakerPersonUtenIdentFeltnavn.ADRESSELINJE2]: '',
                [BrevmottakerPersonUtenIdentFeltnavn.POSTNUMMER]: '0010',
                [BrevmottakerPersonUtenIdentFeltnavn.POSTSTED]: 'Oslo',
            };

            // Act
            const nyBrevmottakerPersonUtenIdent = lagNyBrevmottakerPersonUtenIdent(values);

            // Expect
            expect(nyBrevmottakerPersonUtenIdent.type).toBe(NyBrevmottakerType.PERSON_UTEN_IDENT);
            expect(nyBrevmottakerPersonUtenIdent.mottakerRolle).toBe(
                values[BrevmottakerPersonUtenIdentFeltnavn.MOTTAKERROLLE]
            );
            expect(nyBrevmottakerPersonUtenIdent.landkode).toBe(
                values[BrevmottakerPersonUtenIdentFeltnavn.LANDKODE]
            );
            expect(nyBrevmottakerPersonUtenIdent.navn).toBe(
                values[BrevmottakerPersonUtenIdentFeltnavn.NAVN]
            );
            expect(nyBrevmottakerPersonUtenIdent.adresselinje1).toBe(
                values[BrevmottakerPersonUtenIdentFeltnavn.ADRESSELINJE1]
            );
            expect(nyBrevmottakerPersonUtenIdent.adresselinje2).toBe(
                values[BrevmottakerPersonUtenIdentFeltnavn.ADRESSELINJE2]
            );
            expect(nyBrevmottakerPersonUtenIdent.postnummer).toBe(
                values[BrevmottakerPersonUtenIdentFeltnavn.POSTNUMMER]
            );
            expect(nyBrevmottakerPersonUtenIdent.poststed).toBe(
                values[BrevmottakerPersonUtenIdentFeltnavn.POSTSTED]
            );
        });

        test('skal lage ny brevmottaker person uten ident som kommer fra utlandet', () => {
            // Arrange
            const values: BrevmottakerPersonUtenIdentFormValues = {
                [BrevmottakerPersonUtenIdentFeltnavn.MOTTAKERROLLE]: MottakerRolle.FULLMAKT,
                [BrevmottakerPersonUtenIdentFeltnavn.LANDKODE]: EøsLandkode.DK,
                [BrevmottakerPersonUtenIdentFeltnavn.NAVN]: 'Navn Navnensen',
                [BrevmottakerPersonUtenIdentFeltnavn.ADRESSELINJE1]:
                    'Adresselinje 1, København, 1234',
                [BrevmottakerPersonUtenIdentFeltnavn.ADRESSELINJE2]: '',
                [BrevmottakerPersonUtenIdentFeltnavn.POSTNUMMER]: '',
                [BrevmottakerPersonUtenIdentFeltnavn.POSTSTED]: '',
            };

            // Act
            const nyBrevmottakerPersonUtenIdent = lagNyBrevmottakerPersonUtenIdent(values);

            // Expect
            expect(nyBrevmottakerPersonUtenIdent.type).toBe(NyBrevmottakerType.PERSON_UTEN_IDENT);
            expect(nyBrevmottakerPersonUtenIdent.mottakerRolle).toBe(
                values[BrevmottakerPersonUtenIdentFeltnavn.MOTTAKERROLLE]
            );
            expect(nyBrevmottakerPersonUtenIdent.landkode).toBe(
                values[BrevmottakerPersonUtenIdentFeltnavn.LANDKODE]
            );
            expect(nyBrevmottakerPersonUtenIdent.navn).toBe(
                values[BrevmottakerPersonUtenIdentFeltnavn.NAVN]
            );
            expect(nyBrevmottakerPersonUtenIdent.adresselinje1).toBe(
                values[BrevmottakerPersonUtenIdentFeltnavn.ADRESSELINJE1]
            );
            expect(nyBrevmottakerPersonUtenIdent.adresselinje2).toBe(
                values[BrevmottakerPersonUtenIdentFeltnavn.ADRESSELINJE2]
            );
            expect(nyBrevmottakerPersonUtenIdent.postnummer).toBe(undefined);
            expect(nyBrevmottakerPersonUtenIdent.poststed).toBe(undefined);
        });

        test('skal kaste feil om MottakerRolle ikke er utfylt', () => {
            // Arrange
            const values: BrevmottakerPersonUtenIdentFormValues = {
                [BrevmottakerPersonUtenIdentFeltnavn.MOTTAKERROLLE]: '',
                [BrevmottakerPersonUtenIdentFeltnavn.LANDKODE]: EøsLandkode.DK,
                [BrevmottakerPersonUtenIdentFeltnavn.NAVN]: 'Navn Navnensen',
                [BrevmottakerPersonUtenIdentFeltnavn.ADRESSELINJE1]:
                    'Adresselinje 1, København, 1234',
                [BrevmottakerPersonUtenIdentFeltnavn.ADRESSELINJE2]: '',
                [BrevmottakerPersonUtenIdentFeltnavn.POSTNUMMER]: '',
                [BrevmottakerPersonUtenIdentFeltnavn.POSTSTED]: '',
            };

            // Act & expect
            expect(() => lagNyBrevmottakerPersonUtenIdent(values)).toThrowError(
                new Error('Ugyldig tilstand. Mottaker rolle er påkrevd.')
            );
        });
    });
});
