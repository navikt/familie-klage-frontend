import React from 'react';
import { BodyShort } from '@navikt/ds-react';

interface Props {
    label: string;
    tekst: string;
    className?: string;
}

const TekstMedLabel = ({ className, label, tekst }: Props): JSX.Element => {
    return (
        <div style={{ marginRight: '2rem' }} className={`${className} skjemaelement`}>
            <span className="skjemaelement__label">{label}</span>
            <BodyShort style={{ marginTop: '1rem' }}>{tekst}</BodyShort>
        </div>
    );
};

export default TekstMedLabel;
