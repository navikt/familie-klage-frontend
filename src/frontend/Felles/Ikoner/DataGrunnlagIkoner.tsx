import Register from './Register';
import Søknad from './Søknad';
import React, { FC } from 'react';
import BrukerMedBlyant from './BrukerMedBlyant';

export const Registergrunnlag: FC = () => <Register width={16} heigth={14} />;
export const Søknadsgrunnlag: FC = () => <Søknad width={14} height={19} />;

export const BrukerMedBlyantIkon: FC<{ backgroundColor?: string; frontColor?: string }> = ({
    backgroundColor,
    frontColor,
}) => (
    <BrukerMedBlyant
        width={21}
        heigth={21}
        backgroundColor={backgroundColor}
        frontColor={frontColor}
    />
);
