import { finnGyldigeArbeidsfordelingsenheterForFagsystem } from './arbeidsfordelingsenhet';
import { Fagsystem } from '../../../App/typer/fagsak';
import { expect } from 'vitest';

describe('finnGyldigeArbeidsfordelingsenheterForFagsystem', () => {
    test('skal finne gyldige arbeidsfordelingsenheter for BA', () => {
        // Act
        const arbeidsfordelingsenheter = finnGyldigeArbeidsfordelingsenheterForFagsystem(
            Fagsystem.BA
        );

        // Expect
        expect(arbeidsfordelingsenheter.map((enhet) => enhet.enhetsnummer)).toEqual([
            '2103',
            '4806',
            '4820',
            '4833',
            '4842',
            '4817',
        ]);
    });

    test('skal finne gyldige arbeidsfordelingsenheter for KS', () => {
        // Act
        const arbeidsfordelingsenheter = finnGyldigeArbeidsfordelingsenheterForFagsystem(
            Fagsystem.KS
        );

        // Expect
        expect(arbeidsfordelingsenheter.map((enhet) => enhet.enhetsnummer)).toEqual([
            '2103',
            '4806',
            '4820',
            '4833',
            '4842',
            '4817',
            '4812',
        ]);
    });

    test('skal finne gyldige arbeidsfordelingsenheter for EF', () => {
        // Act
        const arbeidsfordelingsenheter = finnGyldigeArbeidsfordelingsenheterForFagsystem(
            Fagsystem.EF
        );

        // Expect
        expect(arbeidsfordelingsenheter.map((enhet) => enhet.enhetsnummer)).length(0);
    });
});
