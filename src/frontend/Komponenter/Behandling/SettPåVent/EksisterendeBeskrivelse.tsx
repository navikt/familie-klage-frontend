import React, { FC, useCallback, useState } from 'react';
import { BodyShort, Button, Label, VStack } from '@navikt/ds-react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import styles from './EksisterendeBeskrivelse.module.css';

export const EksisterendeBeskrivelse: FC<{ beskrivelse?: string }> = ({ beskrivelse }) => {
    const [harOverflow, settHarOverflow] = useState(false);
    const [ekspandert, settEkspandert] = useState(false);

    const refCallback: React.RefCallback<HTMLElement> = useCallback((ref) => {
        if (ref !== null) {
            settHarOverflow(ref.scrollHeight > ref.clientHeight);
        }
    }, []);

    return (
        <section>
            <VStack gap="2">
                <Label size={'small'}>Beskrivelseshistorikk</Label>
                <div className={styles.venstreSkillelinje}>
                    <BodyShort
                        className={ekspandert ? styles.containerEkspandert : styles.container}
                        ref={refCallback}
                        size="small"
                    >
                        {beskrivelse}
                    </BodyShort>
                    {(harOverflow || ekspandert) && (
                        <Button
                            variant={'tertiary'}
                            icon={ekspandert ? <ChevronUpIcon /> : <ChevronDownIcon />}
                            iconPosition={'right'}
                            type={'button'}
                            onClick={() => settEkspandert((ekspandert) => !ekspandert)}
                        >
                            {ekspandert ? 'Skjul beskrivelsen' : 'Se hele beskrivelsen'}
                        </Button>
                    )}
                </div>
            </VStack>
        </section>
    );
};
