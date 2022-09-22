import * as React from 'react';
import {
    klagehendelseTypeTilTekst,
    Klageresultat,
    utfallTilTekst,
} from '../../../App/typer/klageresultat';
import { compareDesc } from 'date-fns';
import { formaterIsoDato } from '../../../App/utils/formatter';

interface Props {
    klageresultat: Klageresultat[];
}

export const KlageresultatVisning: React.FC<Props> = ({ klageresultat }) => {
    return (
        <>
            {klageresultat
                .sort((a, b) =>
                    compareDesc(
                        new Date(a.mottattEllerAvsluttetTidspunkt),
                        new Date(b.mottattEllerAvsluttetTidspunkt)
                    )
                )
                .map((resultat) => (
                    <div key={resultat.mottattEllerAvsluttetTidspunkt}>
                        <div>{klagehendelseTypeTilTekst[resultat.type]}</div>
                        <div>{resultat.utfall && utfallTilTekst[resultat.utfall]}</div>
                        <div>{formaterIsoDato(resultat.mottattEllerAvsluttetTidspunkt)}</div>
                    </div>
                ))}
        </>
    );
};
