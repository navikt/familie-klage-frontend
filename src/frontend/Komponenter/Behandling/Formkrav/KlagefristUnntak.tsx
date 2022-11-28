import React from 'react';
import { Radio, RadioGroup } from '@navikt/ds-react';
import { FormkravFristUnntak, formkravFristUnntakTilTekst, VilkårStatus } from './typer';

const EndreFormkravVurderinger: React.FC<FormkravFristUnntak> = (formkravFristUnntak) => {
    return (
        <RadioGroup
            legend={'Er unntak for klagefristen oppfylt?'}
            size="medium"
            onChange={() => {
                console.log('onchange');
                // settOppdaterteVurderinger(
                //     (prevState: IFormkravVilkår) => {
                //         return {
                //             ...prevState,
                //             [item.navn]: val,
                //         } as IFormkravVilkår;
                //     }
                // );
                // settIkkePersistertKomponent('formkravVilkår');
            }}
            value={'item.svar'}
        >
            <Radio value={FormkravFristUnntak.UNNTAK_KAN_IKKE_LASTES}>
                {formkravFristUnntakTilTekst[FormkravFristUnntak.UNNTAK_KAN_IKKE_LASTES]}
            </Radio>
            <Radio value={FormkravFristUnntak.UNNTAK_SÆRLIG_GRUNN}>
                {formkravFristUnntakTilTekst[FormkravFristUnntak.UNNTAK_SÆRLIG_GRUNN]}
            </Radio>
            <Radio value={FormkravFristUnntak.IKKE_UNNTAK}>
                {formkravFristUnntakTilTekst[FormkravFristUnntak.IKKE_SATT]}
            </Radio>
        </RadioGroup>
    );
};

export default EndreFormkravVurderinger;
