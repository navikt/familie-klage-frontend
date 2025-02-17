import React, { useState } from 'react';
import {
    Alert,
    BodyShort,
    Box,
    Button,
    Heading,
    Select,
    TextField,
    VStack,
} from '@navikt/ds-react';
import { useApp } from '../../App/context/AppContext';
import { Stønadstype } from '../../App/typer/stønadstype';
import { RessursStatus } from '../../App/typer/ressurs';
import { useNavigate } from 'react-router-dom';
import { Fagsystem } from '../../App/typer/fagsak';

type DummyBehandling = {
    ident: string;
    stønadstype: Stønadstype;
    fagsystem: Fagsystem;
};

export const TestSide: React.FC = () => {
    const { axiosRequest, appEnv } = useApp();
    const navigate = useNavigate();

    const [ident, settIdent] = useState<string>();
    const [stønadstype, settStønadstype] = useState<Stønadstype>();
    const [fagsystem, settFagsystem] = useState<Fagsystem>();
    const [feil, settFeil] = useState<string>();

    const opprettDummyBehandling = () => {
        if (ident && stønadstype && fagsystem) {
            axiosRequest<string, DummyBehandling>({
                method: 'POST',
                url: `/familie-klage/api/test/opprett`,
                data: { ident, stønadstype, fagsystem },
            }).then((resp) => {
                if (resp.status === RessursStatus.SUKSESS) {
                    navigate(`/behandling/${resp.data}/formkrav`);
                } else {
                    settFeil(resp.frontendFeilmelding);
                }
            });
        }
    };

    if (appEnv.miljø !== 'local') {
        return (
            <BodyShort>
                Du må velge en behandling fra fagsystemet for å se på en klagebehandling
            </BodyShort>
        );
    }

    return (
        <Box padding={'10'}>
            <Heading size={'large'}>[Test] Opprett dummy-behandling</Heading>
            <VStack padding={'4'} gap={'5'} width={'25rem'}>
                <TextField
                    label={'Ident'}
                    placeholder={'Ident'}
                    value={ident || ``}
                    onChange={(e) => settIdent(e.target.value)}
                />
                <Select
                    label={'Stønadstype'}
                    value={stønadstype}
                    onChange={(e) => settStønadstype(e.target.value as Stønadstype)}
                >
                    <option>Velg</option>
                    {Object.values(Stønadstype).map((stønadstype) => (
                        <option key={stønadstype} value={stønadstype}>
                            {stønadstype}
                        </option>
                    ))}
                </Select>
                <Select
                    label={'Fagsystem'}
                    value={fagsystem}
                    onChange={(e) => settFagsystem(e.target.value as Fagsystem)}
                >
                    <option>Velg</option>
                    {Object.values(Fagsystem).map((fs) => (
                        <option key={fs} value={fs}>
                            {fs}
                        </option>
                    ))}
                </Select>
                <Button onClick={opprettDummyBehandling}>Lag behandling</Button>
            </VStack>
            {feil && <Alert variant={'error'}>{feil}</Alert>}
        </Box>
    );
};
