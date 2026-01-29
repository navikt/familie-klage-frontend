import React from 'react';

import Styles from './InstitusjonIkon.module.css';
import { Buildings3Icon } from '@navikt/aksel-icons';

interface Props {
    height?: number;
    width?: number;
}

export function InstitusjonIkon({ height = 24, width = 24 }: Props) {
    return (
        <div style={{ height: `${height}px`, width: `${width}px` }} className={Styles.sirkel}>
            <Buildings3Icon height={Math.max(height - 4, 0)} width={Math.max(width - 4, 0)} />
        </div>
    );
}
