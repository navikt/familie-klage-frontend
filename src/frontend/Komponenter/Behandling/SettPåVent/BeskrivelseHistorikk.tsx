import React, { FC, useCallback, useState } from 'react';
import { BodyShort, Button, Label } from '@navikt/ds-react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { styled } from 'styled-components';
import { ABlue300 } from '@navikt/ds-tokens/dist/tokens';

const EkspanderbarContainer = styled(BodyShort)<{ $ekspandert: boolean }>`
    max-height: ${(props) => (props.$ekspandert ? 'none' : '15rem')};
    overflow: hidden;
    white-space: pre-wrap;
    max-width: 50rem;
`;

const VenstreSkillelinje = styled.div`
    border-left: 2px solid ${ABlue300};
    padding-left: 1.5rem;
`;

const BeskrivelseContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

// TODO: Rename denne slik at den matcher det som er satt i ef-sak. Den burde ikke hete BeskrivelseHistorikk da dette er annen komponent.
export const BeskrivelseHistorikk: FC<{ beskrivelse?: string }> = ({ beskrivelse }) => {
    const [harOverflow, settHarOverflow] = useState(false);
    const [ekspandert, settEkspandert] = useState(false);

    const refCallback: React.RefCallback<HTMLElement> = useCallback((ref) => {
        if (ref !== null) {
            settHarOverflow(ref.scrollHeight > ref.clientHeight);
        }
    }, []);

    return (
        <section>
            <BeskrivelseContainer>
                <Label size={'small'}>Beskrivelseshistorikk</Label>
                <VenstreSkillelinje>
                    <EkspanderbarContainer ref={refCallback} $ekspandert={ekspandert} size="small">
                        {beskrivelse}
                    </EkspanderbarContainer>
                    {(harOverflow || ekspandert) && (
                        <Button
                            variant={'tertiary'}
                            icon={ekspandert ? <ChevronUpIcon /> : <ChevronDownIcon />}
                            iconPosition={'right'}
                            type={'button'}
                            onClick={() => settEkspandert((prevstate) => !prevstate)}
                        >
                            {ekspandert ? 'Skjul beskrivelsen' : 'Se hele beskrivelsen'}
                        </Button>
                    )}
                </VenstreSkillelinje>
            </BeskrivelseContainer>
        </section>
    );
};
