/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FormkravHøyre } from './FormkravHøyre';
import { FormkravVenstre } from './FormkravVenstre';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { Vilkårsresultat } from './vilkår';

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

export interface IForm {
    behandlingsId: string;
    fagsakId: string;
    vedtaksdato: string;

    klageMottat: string;
    klageÅrsak: string;
    klageBeskrivelse: string;

    klagePart: Vilkårsresultat;
    klageKonkret: Vilkårsresultat;
    klagefristOverholdt: Vilkårsresultat;
    klageSignert: Vilkårsresultat;

    saksbehandlerBegrunnelse: string;
    sakSistEndret: string;

    fullført: boolean;
}
export const Formkrav: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const [vilkårOppfylt, settVilkårOppfylt] = useState(false);
    const [låst, settLåst] = useState(false);
    const { axiosRequest } = useApp();
    const [formkrav, settFormkrav] = useState<IForm>(``);

    useEffect(() => {
        document.title = 'Oppgavebenk';
        axiosRequest<IForm, null>({
            method: 'GET',
            url: `/familie-klage/api/formkrav/1`,
        }).then((res: Ressurs<IForm>) => {
            if (res.status === RessursStatus.SUKSESS) {
                console.log(res.data);
                settFormkrav(res.data);
            }
        });
    }, [axiosRequest]);

    return (
        <FormKravStyling>
            <FormKravStylingBody>
                <FormkravVenstre vilkårOppfylt={vilkårOppfylt} formkrav={formkrav} låst={låst} />
                <FormkravHøyre
                    behandlingId={behandlingId}
                    vilkårOppfylt={vilkårOppfylt}
                    settVilkårOppfylt={settVilkårOppfylt}
                    låst={låst}
                    settLåst={settLåst}
                />
            </FormKravStylingBody>
        </FormKravStyling>
    );
};
