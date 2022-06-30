import * as React from 'react';
import { Button, Textarea } from '@navikt/ds-react';
import { useState } from 'react';
import { FormkravOppsummering } from './FormkravOppsummering';
import { Vedtak } from './Vedtak';
import { Årsak } from './Årsak';
import { Hjemmel } from './Hjemmel';
import {
    VedtakValg,
    vedtakValgTilTekst,
    årsakValgTilTekst,
    hjemmelValgTilTekst,
} from './vurderingValg';
import styled from 'styled-components';

const VurderingBeskrivelseStyled = styled.div`
    margin: 2rem 4rem 2rem 4rem;
`;

const VurderingKnappStyled = styled(Button)`
    margin: 0 4rem 2rem 4rem;
`;

export const Vurdering: React.FC = () => {
    // Formkravoppsummering
    const [oppfylt, settOppfylt] = useState(1);
    const [muligOppfylt, settMuligOppfylt] = useState(1);
    const [begrunnelse, settBegrunnelse] = useState('Dette er en begrunnelse');
    const [feilmelding, settFeilmelding] = useState('Dette er en feilmelding'); // TODO legge til enum-objekter som sier om det er begrunnelse eller vurdering som mangler

    //Vedtak, Årsak, Hjemmel
    const [vedtak, settVedtak] = useState('');
    const [årsak, settÅrsak] = useState('');
    const [hjemmel, settHjemmel] = useState('');
    const [vurderingsBeskrivelse, settVurderingsbeskrivelse] = useState('');

    return (
        <div>
            <FormkravOppsummering
                oppfylt={oppfylt}
                muligOppfylt={muligOppfylt}
                begrunnelse={begrunnelse}
                feilmelding={feilmelding}
            />
            {oppfylt < muligOppfylt ? (
                ''
            ) : (
                <>
                    <Vedtak settVedtak={settVedtak} vedtakValg={vedtakValgTilTekst} />
                    {vedtak == VedtakValg.OMGJØR_VEDTAK ? (
                        <Årsak settÅrsak={settÅrsak} årsakValg={årsakValgTilTekst} />
                    ) : (
                        ''
                    )}
                    {vedtak == VedtakValg.OPPRETTHOLD_VEDTAK ? (
                        <Hjemmel settHjemmel={settHjemmel} hjemmelValg={hjemmelValgTilTekst} />
                    ) : (
                        ''
                    )}
                    {vedtak == VedtakValg.OPPRETTHOLD_VEDTAK ||
                    vedtak == VedtakValg.OMGJØR_VEDTAK ? (
                        <VurderingBeskrivelseStyled>
                            <Textarea
                                label="Vurdering"
                                value={vurderingsBeskrivelse}
                                onChange={(e) => settVurderingsbeskrivelse(e.target.value)}
                                size="medium"
                            />
                        </VurderingBeskrivelseStyled>
                    ) : (
                        ''
                    )}
                    <VurderingKnappStyled
                        variant="primary"
                        size="medium"
                        disabled={
                            !(
                                vedtak == VedtakValg.OPPRETTHOLD_VEDTAK ||
                                vedtak == VedtakValg.OMGJØR_VEDTAK
                            ) ||
                            vurderingsBeskrivelse.length == 0 ||
                            (årsak.length == 0 && hjemmel.length == 0)
                        }
                    >
                        Large vurdering
                    </VurderingKnappStyled>
                </>
            )}
        </div>
    );
};
