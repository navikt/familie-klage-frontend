import { describe, expect } from 'vitest';
import { lagNyBrevmottakerPersonUtenIdent, NyBrevmottakerType } from './nyBrevmottaker';
import { MottakerRolle } from './mottakerRolle';
import { EøsLandkode } from '../../../Felles/Landvelger/landkode';
import { BrevmottakerFeltnavn, BrevmottakerFormValues } from './baks/modal/form/BrevmottakerForm';

describe('NyBrevmottakerTest', () => {
    describe('LagNyBrevmottakerPersonUtenIdentTest', () => {
        test('skal lage ny brevmottaker person uten ident som kommer fra norge med alle feltene utfylt', () => {
            // Arrange
            const values: BrevmottakerFormValues = {
                [BrevmottakerFeltnavn.MOTTAKERROLLE]: MottakerRolle.FULLMAKT,
                [BrevmottakerFeltnavn.LANDKODE]: EøsLandkode.NO,
                [BrevmottakerFeltnavn.NAVN]: 'Navn Navnensen',
                [BrevmottakerFeltnavn.ADRESSELINJE1]: 'Adresselinje 1',
                [BrevmottakerFeltnavn.ADRESSELINJE2]: 'Adresselinje 2',
                [BrevmottakerFeltnavn.POSTNUMMER]: '0010',
                [BrevmottakerFeltnavn.POSTSTED]: 'Oslo',
            };

            // Act
            const nyBrevmottakerPersonUtenIdent = lagNyBrevmottakerPersonUtenIdent(values);

            // Expect
            expect(nyBrevmottakerPersonUtenIdent.type).toBe(NyBrevmottakerType.PERSON_UTEN_IDENT);
            expect(nyBrevmottakerPersonUtenIdent.mottakerRolle).toBe(
                values[BrevmottakerFeltnavn.MOTTAKERROLLE]
            );
            expect(nyBrevmottakerPersonUtenIdent.landkode).toBe(
                values[BrevmottakerFeltnavn.LANDKODE]
            );
            expect(nyBrevmottakerPersonUtenIdent.navn).toBe(values[BrevmottakerFeltnavn.NAVN]);
            expect(nyBrevmottakerPersonUtenIdent.adresselinje1).toBe(
                values[BrevmottakerFeltnavn.ADRESSELINJE1]
            );
            expect(nyBrevmottakerPersonUtenIdent.adresselinje2).toBe(
                values[BrevmottakerFeltnavn.ADRESSELINJE2]
            );
            expect(nyBrevmottakerPersonUtenIdent.postnummer).toBe(
                values[BrevmottakerFeltnavn.POSTNUMMER]
            );
            expect(nyBrevmottakerPersonUtenIdent.poststed).toBe(
                values[BrevmottakerFeltnavn.POSTSTED]
            );
        });

        test('skal lage ny brevmottaker person uten ident som kommer fra norge uten alle feltene utfylt', () => {
            // Arrange
            const values: BrevmottakerFormValues = {
                [BrevmottakerFeltnavn.MOTTAKERROLLE]: MottakerRolle.FULLMAKT,
                [BrevmottakerFeltnavn.LANDKODE]: EøsLandkode.NO,
                [BrevmottakerFeltnavn.NAVN]: 'Navn Navnensen',
                [BrevmottakerFeltnavn.ADRESSELINJE1]: 'Adresselinje 1',
                [BrevmottakerFeltnavn.ADRESSELINJE2]: '',
                [BrevmottakerFeltnavn.POSTNUMMER]: '0010',
                [BrevmottakerFeltnavn.POSTSTED]: 'Oslo',
            };

            // Act
            const nyBrevmottakerPersonUtenIdent = lagNyBrevmottakerPersonUtenIdent(values);

            // Expect
            expect(nyBrevmottakerPersonUtenIdent.type).toBe(NyBrevmottakerType.PERSON_UTEN_IDENT);
            expect(nyBrevmottakerPersonUtenIdent.mottakerRolle).toBe(
                values[BrevmottakerFeltnavn.MOTTAKERROLLE]
            );
            expect(nyBrevmottakerPersonUtenIdent.landkode).toBe(
                values[BrevmottakerFeltnavn.LANDKODE]
            );
            expect(nyBrevmottakerPersonUtenIdent.navn).toBe(values[BrevmottakerFeltnavn.NAVN]);
            expect(nyBrevmottakerPersonUtenIdent.adresselinje1).toBe(
                values[BrevmottakerFeltnavn.ADRESSELINJE1]
            );
            expect(nyBrevmottakerPersonUtenIdent.adresselinje2).toBe(
                values[BrevmottakerFeltnavn.ADRESSELINJE2]
            );
            expect(nyBrevmottakerPersonUtenIdent.postnummer).toBe(
                values[BrevmottakerFeltnavn.POSTNUMMER]
            );
            expect(nyBrevmottakerPersonUtenIdent.poststed).toBe(
                values[BrevmottakerFeltnavn.POSTSTED]
            );
        });

        test('skal lage ny brevmottaker person uten ident som kommer fra utlandet', () => {
            // Arrange
            const values: BrevmottakerFormValues = {
                [BrevmottakerFeltnavn.MOTTAKERROLLE]: MottakerRolle.FULLMAKT,
                [BrevmottakerFeltnavn.LANDKODE]: EøsLandkode.DK,
                [BrevmottakerFeltnavn.NAVN]: 'Navn Navnensen',
                [BrevmottakerFeltnavn.ADRESSELINJE1]: 'Adresselinje 1, København, 1234',
                [BrevmottakerFeltnavn.ADRESSELINJE2]: '',
                [BrevmottakerFeltnavn.POSTNUMMER]: '',
                [BrevmottakerFeltnavn.POSTSTED]: '',
            };

            // Act
            const nyBrevmottakerPersonUtenIdent = lagNyBrevmottakerPersonUtenIdent(values);

            // Expect
            expect(nyBrevmottakerPersonUtenIdent.type).toBe(NyBrevmottakerType.PERSON_UTEN_IDENT);
            expect(nyBrevmottakerPersonUtenIdent.mottakerRolle).toBe(
                values[BrevmottakerFeltnavn.MOTTAKERROLLE]
            );
            expect(nyBrevmottakerPersonUtenIdent.landkode).toBe(
                values[BrevmottakerFeltnavn.LANDKODE]
            );
            expect(nyBrevmottakerPersonUtenIdent.navn).toBe(values[BrevmottakerFeltnavn.NAVN]);
            expect(nyBrevmottakerPersonUtenIdent.adresselinje1).toBe(
                values[BrevmottakerFeltnavn.ADRESSELINJE1]
            );
            expect(nyBrevmottakerPersonUtenIdent.adresselinje2).toBe(
                values[BrevmottakerFeltnavn.ADRESSELINJE2]
            );
            expect(nyBrevmottakerPersonUtenIdent.postnummer).toBe(undefined);
            expect(nyBrevmottakerPersonUtenIdent.poststed).toBe(undefined);
        });

        test('skal kaste feil om MottakerRolle ikke er utfylt', () => {
            // Arrange
            const values: BrevmottakerFormValues = {
                [BrevmottakerFeltnavn.MOTTAKERROLLE]: '',
                [BrevmottakerFeltnavn.LANDKODE]: EøsLandkode.DK,
                [BrevmottakerFeltnavn.NAVN]: 'Navn Navnensen',
                [BrevmottakerFeltnavn.ADRESSELINJE1]: 'Adresselinje 1, København, 1234',
                [BrevmottakerFeltnavn.ADRESSELINJE2]: '',
                [BrevmottakerFeltnavn.POSTNUMMER]: '',
                [BrevmottakerFeltnavn.POSTSTED]: '',
            };

            // Act & expect
            expect(() => lagNyBrevmottakerPersonUtenIdent(values)).toThrowError(
                new Error('Ugyldig tilstand. Mottaker rolle er påkrevd.')
            );
        });
    });
});
