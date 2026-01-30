import * as React from 'react';
import { JenteIkon } from '../Ikoner/JenteIkon';
import { KvinneIkon } from '../Ikoner/KvinneIkon';
import { GuttIkon } from '../Ikoner/GuttIkon';
import { MannIkon } from '../Ikoner/MannIkon';
import { NøytralPersonIkon } from '../Ikoner/NøytralPersonIkon';
import { Kjønn } from '../../App/typer/personopplysninger';

export interface Props {
    alder: number;
    kjønn: Kjønn;
    width: number;
    height: number;
}

export const IkonVelger: React.FunctionComponent<Props> = ({ alder, kjønn, width, height }) => {
    switch (kjønn) {
        case Kjønn.KVINNE:
            if (alder < 18) {
                return <JenteIkon heigth={height} width={width} />;
            } else {
                return <KvinneIkon heigth={height} width={width} />;
            }
        case Kjønn.MANN:
            if (alder < 18) {
                return <GuttIkon heigth={height} width={width} />;
            } else {
                return <MannIkon heigth={height} width={width} />;
            }
        default:
            return <NøytralPersonIkon heigth={height} width={width} />;
    }
};
