import * as React from 'react';
import { StegType } from '../../../App/typer/fagsak';

export const StegObjekt: React.FC<{ steg: StegType }> = ({ steg }) => {
    return (
        <div>
            <div>{steg}</div>
        </div>
    );
};
