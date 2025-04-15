import { Button } from '@navikt/ds-react';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { EnsligTextArea } from '../../../Felles/Input/EnsligTextArea';
import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { harVerdi } from '../../../App/utils/utils';
import { IVurdering } from './vurderingValg';

const FritekstWrapper = styled.div`
    margin: 0 4rem 2rem 4rem;
`;

const KnappWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-right: 4rem;
    margin-bottom: -1.75rem;
`;

export const InterntNotat: React.FC<{
    behandlingErRedigerbar: boolean;
    tekst?: string;
    settIkkePersistertKomponent: (verdi: string) => void;
    settOppdatertVurdering: (vurdering: React.SetStateAction<IVurdering>) => void;
}> = ({ behandlingErRedigerbar, tekst, settIkkePersistertKomponent, settOppdatertVurdering }) => {
    const [skalViseFritekstFelt, settSkalViseFritekstFelt] = useState<boolean>(harVerdi(tekst));

    const oppdaterTekst = (tekst?: string) => {
        settOppdatertVurdering((prevState) => ({
            ...prevState,
            interntNotat: tekst,
        }));
        settIkkePersistertKomponent('internt-notat');
    };

    const handleClick = () => {
        if (skalViseFritekstFelt) {
            oppdaterTekst(undefined);
        }
        settSkalViseFritekstFelt(!skalViseFritekstFelt);
    };

    const utledIkon = (skalViseFritekstFelt: boolean) =>
        skalViseFritekstFelt ? (
            <TrashIcon fontSize="1.5rem" />
        ) : (
            <PlusCircleIcon fontSize="1.5rem" />
        );

    return (
        <>
            <KnappWrapper>
                <Button
                    variant={'tertiary'}
                    icon={utledIkon(skalViseFritekstFelt)}
                    onClick={handleClick}
                >
                    {skalViseFritekstFelt ? 'Fjern internt notat' : 'Skriv internt notat'}
                </Button>
            </KnappWrapper>
            {skalViseFritekstFelt && (
                <FritekstWrapper>
                    <EnsligTextArea
                        label={'Internt notat'}
                        readOnly={!behandlingErRedigerbar}
                        onChange={(e) => oppdaterTekst(e.target.value)}
                        value={tekst}
                    />
                </FritekstWrapper>
            )}
        </>
    );
};
