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

const FormKravStylingFooter = styled.div`
    width: 100%;
    padding-left: 5rem;
    display: flex;
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
export const Formkrav: React.FC = () => {
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
                <FormkravVenstre låst={låst} formkrav={formkrav} />
                <FormkravHøyre låst={låst} settLåst={settLåst} />
            </FormKravStylingBody>
            <FormKravStylingFooter></FormKravStylingFooter>
        </FormKravStyling>
    );
};
