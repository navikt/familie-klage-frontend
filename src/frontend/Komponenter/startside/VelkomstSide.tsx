import React, { useEffect, useState } from 'react';
import { Side } from '../../Felles/Visningskomponenter/Side';
import { Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import { Normaltekst } from 'nav-frontend-typografi';
import styled from 'styled-components';

const Visningstekst = styled(Normaltekst)`
    text-align: center;
    text-transform: uppercase;
    color: #4caf50;
    font-size: 5rem;
    margin: 4rem;
`;

interface IForm {
    behandlingsId: string;
    fagsakId: string;
    vedtaksdato: string;

    klageMottatt: string;
    klageÅrsak: string;
    klageBeskrivelse: string;

    klagePart: boolean;
    klageKonkret: boolean;
    klagefristOverholdt: boolean;
    klageSignert: boolean;

    saksbehandlerBegrunnelse: string;
    sakSistEndret: string;

    fullført: boolean;
}

export const VelkomstSide: React.FC = () => {
    const { axiosRequest } = useApp();
    const [visningstekst, settVisningstekst] = useState<string>();

    useEffect(() => {
        document.title = 'Oppgavebenk';
        axiosRequest<IForm, null>({
            method: 'GET',
            url: `/familie-klage/api/formkrav/1`,
        }).then((res: Ressurs<IForm>) => {
            if (res.status === RessursStatus.SUKSESS) {
                console.log(res.data);
                settVisningstekst('hei' + res.data.behandlingsId);
            }
        });
    }, [axiosRequest]);

    return (
        <Side className={'container'}>
            <Visningstekst>Hello world</Visningstekst>
            <Visningstekst>{visningstekst}</Visningstekst>
        </Side>
    );
};
