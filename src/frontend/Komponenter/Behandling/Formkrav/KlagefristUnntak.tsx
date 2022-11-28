import React from 'react';
import { Radio, RadioGroup } from '@navikt/ds-react';
import { FormkravFristUnntak, formkravFristUnntakTilTekst } from './typer';

const EndreFormkravVurderinger: React.FC = () => {
    const handleChange = (val: any) => console.log('handle', val);

    return (
        <RadioGroup
            legend={'Er unntak for klagefristen oppfylt?'}
            size="medium"
            onChange={(val: FormkravFristUnntak) => handleChange(val)}
            value={(val: FormkravFristUnntak) => console.log('value', val)}
        >
            <Radio value={FormkravFristUnntak.UNNTAK_KAN_IKKE_LASTES}>
                {formkravFristUnntakTilTekst[FormkravFristUnntak.UNNTAK_KAN_IKKE_LASTES]}
            </Radio>
            <Radio value={FormkravFristUnntak.UNNTAK_SÆRLIG_GRUNN}>
                {formkravFristUnntakTilTekst[FormkravFristUnntak.UNNTAK_SÆRLIG_GRUNN]}
            </Radio>
            <Radio value={FormkravFristUnntak.IKKE_UNNTAK}>
                {formkravFristUnntakTilTekst[FormkravFristUnntak.IKKE_UNNTAK]}
            </Radio>
        </RadioGroup>
    );
};

export default EndreFormkravVurderinger;
