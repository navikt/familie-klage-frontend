import { Button } from '@navikt/ds-react';
import { AddCircle, Delete } from '@navikt/ds-icons';
import { EnsligTextArea } from '../../../Felles/Input/EnsligTextArea';
import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { harVerdi } from '../../../App/utils/utils';

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
    oppdaterTekst: (tekst?: string) => void;
}> = ({ behandlingErRedigerbar, tekst, oppdaterTekst }) => {
    const [skalViseFritekstFelt, settSkalViseFritekstFelt] = useState<boolean>(harVerdi(tekst));

    const handleClick = () => {
        if (skalViseFritekstFelt) {
            oppdaterTekst(undefined);
        }
        settSkalViseFritekstFelt(!skalViseFritekstFelt);
    };

    return (
        <>
            <KnappWrapper>
                <Button
                    variant={'tertiary'}
                    icon={skalViseFritekstFelt ? <Delete /> : <AddCircle />}
                    onClick={handleClick}
                >
                    {skalViseFritekstFelt ? 'Fjern internt notat' : 'Skriv internt notat'}
                </Button>
            </KnappWrapper>
            {skalViseFritekstFelt && (
                <FritekstWrapper>
                    <EnsligTextArea
                        label={'Internt notat'}
                        erLesevisning={!behandlingErRedigerbar}
                        onChange={(e) => oppdaterTekst(e.target.value)}
                        value={tekst}
                    />
                </FritekstWrapper>
            )}
        </>
    );
};
