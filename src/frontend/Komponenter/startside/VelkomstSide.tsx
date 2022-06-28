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

export const VelkomstSide: React.FC = () => {
    const { axiosRequest } = useApp();
    const [visningstekst, settVisningstekst] = useState<string>('Fikk ikke kontakt med backend');

    useEffect(() => {
        document.title = 'Oppgavebenk';
        axiosRequest<string, null>({
            method: 'GET',
            url: `/familie-klage/api/test`,
        }).then((res: Ressurs<string>) => {
            if (res.status === RessursStatus.SUKSESS) {
                settVisningstekst(res.data);
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
