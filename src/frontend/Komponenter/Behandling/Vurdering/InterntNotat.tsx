import { Button } from '@navikt/ds-react';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { EnsligTextArea } from '../../../Felles/Input/EnsligTextArea';
import * as React from 'react';
import { useState } from 'react';
import styles from './InterntNotat.module.css';
import { harVerdi } from '../../../App/utils/utils';
import { IVurdering } from './vurderingValg';

export const InterntNotat: React.FC<{
    behandlingErRedigerbar: boolean;
    vurderingEndret: boolean;
    settVurderingEndret: (value: React.SetStateAction<boolean>) => void;
    tekst?: string;
    settIkkePersistertKomponent: (verdi: string) => void;
    settOppdatertVurdering: (vurdering: React.SetStateAction<IVurdering>) => void;
}> = ({
    behandlingErRedigerbar,
    vurderingEndret,
    settVurderingEndret,
    tekst,
    settIkkePersistertKomponent,
    settOppdatertVurdering,
}) => {
    const [skalViseFritekstFelt, settSkalViseFritekstFelt] = useState<boolean>(harVerdi(tekst));

    const oppdaterTekst = (tekst?: string) => {
        if (!vurderingEndret) {
            settVurderingEndret(true);
        }
        settOppdatertVurdering((prevState) => ({
            ...prevState,
            interntNotat: tekst,
        }));
        settIkkePersistertKomponent('internt-notat');
    };

    const oppdaterSkalViseFritekstFelt = () => {
        if (skalViseFritekstFelt) {
            oppdaterTekst(undefined);
        }
        settSkalViseFritekstFelt((prevState) => !prevState);
    };

    const knappIkon = skalViseFritekstFelt ? (
        <TrashIcon fontSize="1.5rem" />
    ) : (
        <PlusCircleIcon fontSize="1.5rem" />
    );

    const knappTekst = skalViseFritekstFelt ? 'Fjern internt notat' : 'Skriv internt notat';

    return (
        <>
            <Button
                variant={'tertiary'}
                icon={knappIkon}
                onClick={oppdaterSkalViseFritekstFelt}
                className={styles.interntNotatButton}
            >
                {knappTekst}
            </Button>
            {skalViseFritekstFelt && (
                <EnsligTextArea
                    label={'Internt notat'}
                    readOnly={!behandlingErRedigerbar}
                    onChange={(e) => oppdaterTekst(e.target.value)}
                    value={tekst}
                />
            )}
        </>
    );
};
