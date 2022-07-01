import * as React from 'react';
import { useState } from 'react';
import { Alert, Button, Textarea } from '@navikt/ds-react';
import { FormkravOppsummering } from './FormkravOppsummering';
import { Vedtak } from './Vedtak';
import { Årsak } from './Årsak';
import { Hjemmel } from './Hjemmel';
import {
    hjemmelValgTilTekst,
    VedtakValg,
    vedtakValgTilTekst,
    IVurdering,
    årsakValgTilTekst,
} from './vurderingValg';
import styled from 'styled-components';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';

const VurderingBeskrivelseStyled = styled.div`
    margin: 2rem 4rem 2rem 4rem;
`;

const AlertStyled = styled(Alert)`
    margin: 2rem 4rem 2rem 4rem;
`;

const VurderingKnappStyled = styled(Button)`
    margin: 0 4rem 2rem 4rem;
`;

export const Vurdering: React.FC = () => {
    //Backend
    const { axiosRequest } = useApp();

    // TODO koble til backend og hente ut data fra formkrav
    /*useEffect(() => {
        axiosRequest<Formkrav, string>({
            method: 'GET',
            url: `/familie-klage/api/formkrav/${behandlingId}`,
        }).then((res: Ressurs<Formkrav>) => {
            if (res.status === RessursStatus.SUKSESS) {
                settOppfylt(res.data.oppfylt);
                settMuligOppfylt(res.data.muligOppfylt);
                settBegrunnelse(res.data.begrunnelse);
                settFeilmelding(res.data.feilmelding)
            }
        });
    }, [axiosRequest]);*/

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

    // Resultat
    const [resultat, settResultat] = useState(false);

    const opprettVurdering = () => {
        const v: IVurdering = {
            oppfyltFormkrav: oppfylt, // TODO Kan være denne kun kan ligge i formkrav
            muligFormkrav: muligOppfylt, // TODO Kan være denne kun kan ligge i formkrav
            begrunnelse: begrunnelse, // TODO Kan være denne kun kan ligge i formkrav
            vedtakValg: VedtakValg.OMGJØR_VEDTAK,
            beskrivelse: vurderingsBeskrivelse,
        };

        axiosRequest<IVurdering, IVurdering>({
            method: 'POST',
            url: `/familie-klage/api/vurdering`,
            data: v,
        }).then((res: Ressurs<IVurdering>) => {
            if (res.status === RessursStatus.SUKSESS) {
                settResultat(true);
            }
        });
    };

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
                    {resultat ? (
                        <AlertStyled variant="success" size="medium" inline>
                            Du har lagret vurderingen.
                        </AlertStyled>
                    ) : (
                        ''
                    )}

                    <VurderingKnappStyled
                        variant="primary"
                        size="medium"
                        onClick={() => {
                            opprettVurdering();
                        }}
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
