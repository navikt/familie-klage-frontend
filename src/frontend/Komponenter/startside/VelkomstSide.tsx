import React, { useEffect, useState } from 'react';
import { Side } from '../../Felles/Visningskomponenter/Side';
import { Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import { Normaltekst } from 'nav-frontend-typografi';

export const VelkomstSide: React.FC = () => {
    const { axiosRequest } = useApp();
    const [velkomstTekst, settVelkomstTekst] = useState<string>('Ikke koblet til backend');

    useEffect(() => {
        document.title = 'Oppgavebenk';
        axiosRequest<null, null>({
            method: 'GET',
            url: `/familie-ef-klage/api/test`,
        }).then((res: Ressurs<null>) => {
            if (res.status === RessursStatus.SUKSESS) {
                settVelkomstTekst('Koblet til backend');
            }
        });
    }, []);

    return (
        <Side className={'container'}>
            <Normaltekst>Hello world</Normaltekst>
            <Normaltekst>{velkomstTekst}</Normaltekst>
        </Side>
    );
};
