import React, { useState } from 'react';
import styled from 'styled-components';
import { Side } from '../../Felles/Visningskomponenter/Side';
import { Alert, Button } from '@navikt/ds-react';
import { useApp } from '../../App/context/AppContext';
import { Stønadstype } from '../../App/typer/behandlingstema';
import { RessursStatus } from '../../App/typer/ressurs';
import { useNavigate } from 'react-router-dom';

const StyledTest = styled.div`
    display: flex;
    flex-direction: column;
    width: 15rem;
    margin: 2rem;
`;

export const TestSide: React.FC = () => {
    const { axiosRequest, appEnv } = useApp();
    const [ident, settIdent] = useState<string>();
    const [feil, settFeil] = useState<string>();
    const [stønadstype, settStønadstype] = useState<Stønadstype>();
    const navigate = useNavigate();

    const opprettDummyBehandling = () => {
        if (ident && stønadstype) {
            axiosRequest<string, { ident: string; stønadstype: Stønadstype }>({
                method: 'POST',
                url: `/familie-klage/api/test/opprett`,
                data: { ident, stønadstype },
            }).then((resp) => {
                if (resp.status === RessursStatus.SUKSESS) {
                    navigate(`/behandling/${resp.data}/formkrav`);
                } else {
                    settFeil(resp.frontendFeilmelding);
                }
            });
        }
    };

    if (appEnv.namespace !== 'local') {
        return <></>;
    }

    return (
        <Side className={'container'}>
            <StyledTest>
                <b>[Test] Opprett dummy-behandling</b>
                <input
                    placeholder={'Ident'}
                    value={ident || ``}
                    onChange={(e) => settIdent(e.target.value)}
                />
                <select
                    value={stønadstype}
                    onChange={(e) => settStønadstype(e.target.value as Stønadstype)}
                >
                    <option>Velg</option>
                    {Object.values(Stønadstype).map((stønadstype) => (
                        <option key={stønadstype} value={stønadstype}>
                            {stønadstype}
                        </option>
                    ))}
                </select>
                <Button onClick={opprettDummyBehandling}>Lag behandling</Button>
            </StyledTest>
            {feil && <Alert variant={'error'}>{feil}</Alert>}
        </Side>
    );
};
