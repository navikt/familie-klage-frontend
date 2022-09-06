// React
import * as React from 'react';

// CSS
import styled from 'styled-components';

// Komponenter
import { Heading } from '@navikt/ds-react';
import {
    Hjemmel,
    hjemmelTilTekst,
    vedtakValgTilTekst,
    ÅrsakOmgjøring,
    årsakValgTilTekst,
} from './vurderingValg';
import { useBehandling } from '../../../App/context/BehandlingContext';

const VurderingLesemodusDiv = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 4rem;
`;

const VurderingLesemodusPunkt = styled.div`
    margin: 0 0 2rem 0;
`;

export const VurderingLesemodus: React.FC = () => {
    const { vurderingData } = useBehandling();

    return (
        <div>
            <VurderingLesemodusDiv>
                <VurderingLesemodusPunkt>
                    <Heading level="1" size="medium">
                        Vedtak
                    </Heading>
                    {vedtakValgTilTekst[vurderingData.vedtak]}
                </VurderingLesemodusPunkt>
                {vurderingData.arsak !== undefined && vurderingData.arsak !== ÅrsakOmgjøring.VELG && (
                    <VurderingLesemodusPunkt>
                        <Heading level="1" size="medium">
                            Årsak
                        </Heading>
                        {årsakValgTilTekst[vurderingData.arsak]}
                    </VurderingLesemodusPunkt>
                )}

                {vurderingData.hjemmel !== undefined && vurderingData.hjemmel !== Hjemmel.VELG && (
                    <VurderingLesemodusPunkt>
                        <Heading level="1" size="medium">
                            Hjemmel
                        </Heading>
                        {hjemmelTilTekst[vurderingData.hjemmel]}
                    </VurderingLesemodusPunkt>
                )}
                <Heading level="1" size="medium">
                    Vurdering
                </Heading>
                {vurderingData.beskrivelse}
            </VurderingLesemodusDiv>
        </div>
    );
};
