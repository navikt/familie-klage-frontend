import { Alert, Box, Link, Loader, VStack } from '@navikt/ds-react';
import { LinkIcon } from '@navikt/aksel-icons';
import React, { useState } from 'react';
import { base64toBlob, åpnePdfIEgenTab } from '../../../App/utils/utils';
import { useLagHenleggelsesbrev } from './hooks/useLagHenleggelsesbrev';
import { Behandling } from '../../../App/typer/fagsak';
import { useBrevmottakereContext } from './context/BrevmottakereContextProvider';

const filnavn = 'Forhåndsvisning av trukket søknadsbrev';

interface Props {
    behandling: Behandling;
}

export function ForhåndsvisBrevLenke({ behandling }: Props) {
    const lagHenleggelsesbrev = useLagHenleggelsesbrev();
    const { brevmottakere } = useBrevmottakereContext();

    const [feilmelding, settFeilmelding] = useState<string>('');
    const [laster, settLaster] = useState<boolean>(false);

    async function hentOgÅpneBrevINyFane(): Promise<Awaited<void>> {
        settLaster(true);
        return lagHenleggelsesbrev(behandling.id, { brevmottakere })
            .then((brev) => base64toBlob(brev, 'application/pdf'))
            .then((blob) => åpnePdfIEgenTab(blob, filnavn))
            .catch((error: Error) => settFeilmelding(error.message))
            .finally(() => settLaster(false));
    }

    return (
        <Box paddingBlock={'space-12'}>
            <VStack gap={'2'}>
                {feilmelding && (
                    <Alert
                        variant={'error'}
                        size={'small'}
                        closeButton={true}
                        onClose={() => settFeilmelding('')}
                    >
                        {feilmelding}
                    </Alert>
                )}
                <Link onClick={hentOgÅpneBrevINyFane} href={'#'}>
                    Forhåndsvis brev
                    {laster && <Loader size={'xsmall'} />}
                    {!laster && <LinkIcon title={'Forhåndsvis brev'} fontSize={'1.5rem'} />}
                </Link>
            </VStack>
        </Box>
    );
}
