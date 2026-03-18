import * as React from 'react';
import { JenteIkon } from '../Ikoner/JenteIkon';
import { KvinneIkon } from '../Ikoner/KvinneIkon';
import { GuttIkon } from '../Ikoner/GuttIkon';
import { MannIkon } from '../Ikoner/MannIkon';
import { NøytralPersonIkon } from '../Ikoner/NøytralPersonIkon';
import { Kjønn } from '../../App/typer/personopplysninger';
import { Institusjon } from '../../App/typer/institusjon';
import { InstitusjonIkon } from '../Ikoner/InstitusjonIkon';

export interface Props {
    kjønn: Kjønn;
    alder?: number;
    institusjon?: Institusjon;
    width?: number;
    height?: number;
}

export const IkonVelger: React.FunctionComponent<Props> = ({
    kjønn,
    alder,
    institusjon,
    width = 24,
    height = 24,
}) => {
    if (institusjon) {
        return <InstitusjonIkon height={height} width={width} />;
    }
    switch (kjønn) {
        case Kjønn.KVINNE:
            if (!!alder && alder < 18) {
                return <JenteIkon heigth={height} width={width} />;
            } else {
                return <KvinneIkon heigth={height} width={width} />;
            }
        case Kjønn.MANN:
            if (!!alder && alder < 18) {
                return <GuttIkon heigth={height} width={width} />;
            } else {
                return <MannIkon heigth={height} width={width} />;
            }
        default:
            return <NøytralPersonIkon heigth={height} width={width} />;
    }
};
