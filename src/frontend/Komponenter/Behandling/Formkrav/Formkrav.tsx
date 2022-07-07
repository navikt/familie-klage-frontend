/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Formvilkår } from './Formvilkår';
import { Klageinfo } from './Klageinfo';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { IForm } from './utils';

const FormKravStyling = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    margin: 2rem 5rem 0 5rem;
`;

const FormKravStylingBody = styled.div`
    display: flex;
    @media only screen and (max-width: 800px) {
        flex-direction: column;
    }
    width: 100%;
`;

export const Formkrav: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const [vilkårOppfylt, settVilkårOppfylt] = useState(false);
    const { axiosRequest } = useApp();
    const [formkrav, settFormkrav] = useState<IForm>();
    const { formkravLåst, settFormkravLåst } = useBehandling();

    useEffect(() => {
        document.title = 'Oppgavebenk';
        axiosRequest<IForm, null>({
            method: 'GET',
            url: `/familie-klage/api/formkrav/${behandlingId}`,
        }).then((res: Ressurs<IForm>) => {
            if (res.status === RessursStatus.SUKSESS) {
                settFormkrav(res.data);
            }
        });
    }, [axiosRequest, behandlingId]);

    return (
        <FormKravStyling>
            <FormKravStylingBody>
                {formkrav !== undefined && (
                    <Klageinfo
                        vilkårOppfylt={vilkårOppfylt}
                        formkrav={formkrav}
                        låst={formkravLåst}
                    />
                )}
                <Formvilkår
                    behandlingId={behandlingId}
                    vilkårOppfylt={vilkårOppfylt}
                    settVilkårOppfylt={settVilkårOppfylt}
                    låst={formkravLåst}
                    settLåst={settFormkravLåst}
                />
            </FormKravStylingBody>
        </FormKravStyling>
    );
};
