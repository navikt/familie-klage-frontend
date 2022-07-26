import React from 'react';
import styled from 'styled-components';
import { Side } from '../../Felles/Visningskomponenter/Side';
import { Button } from '@navikt/ds-react';
import { useApp } from '../../App/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Behandling, StegType } from '../../App/typer/fagsak';
import { HjemmelValg, IVurdering, VedtakValg } from '../Behandling/Vurdering/vurderingValg';
import { IFormVilkår, VilkårStatus } from '../Behandling/Formkrav/utils';

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
        const finnSteg = () => {
            if (url === 'resultat') return StegType.BEHANDLING_FERDIGSTILT;
            else if (url === 'brev') return StegType.BREV;
            else if (url === 'vurdering') return StegType.VURDERING;
            else return StegType.FORMKRAV;
        };
        axiosRequest<Behandling, null>({
            method: 'POST',
            url: `/familie-klage/api/behandling`,
        }).then((res) => {
            if (res.status === 'SUKSESS') {
                navigate(`/behandling/${res.data.id}/${url}`);
                const behandlingSteg = {
                    stegType: finnSteg(),
                };
                axiosRequest<string, { stegType: StegType }>({
                    method: 'POST',
                    url: `/familie-klage/api/behandling/${res.data.id}`,
                    data: behandlingSteg,
                });
                if (url !== '') {
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
                            axiosRequest<null, null>({
                                method: 'POST',
                                url: `/familie-klage/api/behandling/ferdigstill/${res.data.id}`,
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
                <Button onClick={() => lagBehandling('')}>Lag behandling</Button>
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
