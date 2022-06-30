import React, { useEffect } from 'react';
import { useApp } from '../App/context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@navikt/ds-react';
import { Behandling } from '../App/typer/fagsak';

export const Test: React.FC = () => {
    const { axiosRequest } = useApp();
    const uuid = uuidv4();

    useEffect(() => {
        document.title = 'Test';
    }, []);

    const opprettBehandling = () => {
        axiosRequest<Behandling, string>({
            method: 'POST',
            url: `/familie-klage/api/behandling/${uuid}`,
            data: uuid,
        });
    };

    return <Button onClick={() => opprettBehandling()}>Opprett behandling</Button>;
};
