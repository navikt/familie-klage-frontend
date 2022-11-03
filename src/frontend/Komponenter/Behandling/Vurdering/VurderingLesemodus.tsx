// React
import * as React from 'react';

// CSS
import styled from 'styled-components';

// Komponenter
import { Heading } from '@navikt/ds-react';
import { hjemmelTilTekst, vedtakValgTilTekst, årsakValgTilTekst } from './vurderingValg';
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
    const { oppdatertVurdering } = useBehandling();

    return (
        <div>
            <VurderingLesemodusDiv>
                <VurderingLesemodusPunkt>
                    <Heading level="1" size="medium">
                        Vedtak
                    </Heading>
                    {oppdatertVurdering.vedtak && vedtakValgTilTekst[oppdatertVurdering.vedtak]}
                </VurderingLesemodusPunkt>
                {oppdatertVurdering.arsak && (
                    <VurderingLesemodusPunkt>
                        <Heading level="1" size="medium">
                            Årsak
                        </Heading>
                        {årsakValgTilTekst[oppdatertVurdering.arsak]}
                    </VurderingLesemodusPunkt>
                )}

                {oppdatertVurdering.hjemmel && (
                    <VurderingLesemodusPunkt>
                        <Heading level="1" size="medium">
                            Hjemmel
                        </Heading>
                        {hjemmelTilTekst[oppdatertVurdering.hjemmel]}
                    </VurderingLesemodusPunkt>
                )}
                <Heading level="1" size="medium">
                    Vurdering
                </Heading>
                {oppdatertVurdering.innstillingKlageinstans}
            </VurderingLesemodusDiv>
        </div>
    );
};
