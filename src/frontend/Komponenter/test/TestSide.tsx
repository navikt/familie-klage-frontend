import React from 'react';
import styled from 'styled-components';
import { Side } from '../../Felles/Visningskomponenter/Side';
import { Button } from '@navikt/ds-react';
import { useApp } from '../../App/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Behandling } from '../../App/typer/fagsak';
import { HjemmelValg, IVurdering, VedtakValg } from '../Behandling/Vurdering/vurderingValg';
import { IFormVilkår, VilkårStatus } from '../Behandling/Formkrav/utils';
import { FritekstBrevtype, IFritekstBrev } from '../Behandling/Brev/BrevTyper';
import { Ressurs } from '../../App/typer/ressurs';

const StyledTest = styled.div`
    display: flex;
    flex-direction: column;
    width: 10rem;
    margin: 2rem;
`;

export const TestSide: React.FC = () => {
    const { axiosRequest } = useApp();
    const navigate = useNavigate();

    const lagBehandling = (url: string) => {
        axiosRequest<Behandling, null>({
            method: 'POST',
            url: `/familie-klage/api/behandling`,
        }).then((res) => {
            if (res.status === 'SUKSESS') {
                navigate(`/behandling/${res.data.id}/${url}`);
                if (url !== 'formkrav') {
                    // formkravrequest
                    const formObjekt: IFormVilkår = {
                        behandlingId: res.data.id,
                        fagsakId: 'b0fa4cae-a676-44b3-8725-232dac935c4a',
                        klagePart: VilkårStatus.OPPFYLT,
                        klageKonkret: VilkårStatus.OPPFYLT,
                        klagefristOverholdt: VilkårStatus.OPPFYLT,
                        klageSignert: VilkårStatus.OPPFYLT,
                        saksbehandlerBegrunnelse: 'Dummy begrunnelse',
                        endretTid: new Date().toISOString().split('T')[0],
                    };
                    axiosRequest<IFormVilkår, IFormVilkår>({
                        method: 'POST',
                        url: `/familie-klage/api/formkrav`,
                        data: formObjekt,
                    });

                    if (url !== 'vurdering') {
                        // vurderingrequest
                        const vurderingObjekt: IVurdering = {
                            behandlingId: res.data.id,
                            vedtak: VedtakValg.OPPRETTHOLD_VEDTAK,
                            hjemmel: HjemmelValg.FEMTEN_FIRE,
                            beskrivelse: 'beskrivelse',
                        };

                        axiosRequest<IVurdering, IVurdering>({
                            method: 'POST',
                            url: `/familie-klage/api/vurdering`,
                            data: vurderingObjekt,
                        });

                        if (url !== 'brev') {
                            // brevrequest
                            const brev: IFritekstBrev = {
                                overskrift: 'Overskrift',
                                avsnitt: [],
                                behandlingId: res.data.id,
                                brevType: FritekstBrevtype.VEDTAK_AVSLAG_BARNETILSYN,
                            };

                            axiosRequest<string, IFritekstBrev>({
                                method: 'POST',
                                url: `/familie-klage/api/brev/`,
                                data: brev,
                            }).then((brevRes: Ressurs<string>) => {
                                if (brevRes.status === 'SUKSESS') {
                                    axiosRequest<null, null>({
                                        method: 'POST',
                                        url: `/familie-klage/api/behandling/ferdigstill/${res.data.id}`,
                                    });
                                }
                            });
                        }
                    }
                }
            }
        });
    };

    return (
        <Side className={'container'}>
            <StyledTest>
                <b>[Test] Opprett dummy-behandling og gå til formkrav</b>
                <Button onClick={() => lagBehandling('formkrav')}>Lag behandling</Button>
            </StyledTest>
            <StyledTest>
                <b>[Test] Opprett dummy-behandling og gå til vurdering</b>
                <Button onClick={() => lagBehandling('vurdering')}>Lag behandling</Button>
            </StyledTest>
            <StyledTest>
                <b>[Test] Opprett dummy-behandling og gå til brev</b>
                <Button onClick={() => lagBehandling('brev')}>Lag behandling</Button>
            </StyledTest>
            <StyledTest>
                <b>[Test] Opprett dummy-behandling og gå til resultat</b>
                <Button onClick={() => lagBehandling('resultat')}>Lag behandling</Button>
            </StyledTest>
        </Side>
    );
};
