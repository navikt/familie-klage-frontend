import { Alert, Box, Button, Heading, Select, TextField, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../App/context/AppContext';
import { Fagsystem, stønadstyperForFagsystem } from '../../App/typer/fagsak';
import { RessursStatus } from '../../App/typer/ressurs';
import { type Stønadstype, stønadstypeTilTekst } from '../../App/typer/stønadstype';
import { finnGyldigeArbeidsfordelingsenheterForFagsystem } from '../Behandling/EndreBehandlendeEnhet/arbeidsfordelingsenhet';

type DummyBehandling = {
    ident: string;
    stønadstype: Stønadstype;
    fagsystem: Fagsystem;
    behandlendeEnhet: string;
};

// Vikafossen er forbeholdt strengt fortrolige saker, og passer ikke for en dummy-behandling.
const VIKAFOSSEN = '2103';
// EF har ingen arbeidsfordelingsenheter i lista, og bruker fallback-enheten.
const ENHET_UTEN_ARBEIDSFORDELING = '4489';

const utledBehandlendeEnhetForFagsystem = (fagsystem: Fagsystem): string =>
    finnGyldigeArbeidsfordelingsenheterForFagsystem(fagsystem).find(enhet => enhet.enhetsnummer !== VIKAFOSSEN)
        ?.enhetsnummer ?? ENHET_UTEN_ARBEIDSFORDELING;

export const TestSide = () => {
    const { axiosRequest } = useApp();
    const navigate = useNavigate();

    const [ident, settIdent] = useState('');
    const [fagsystem, settFagsystem] = useState<Fagsystem | ''>('');
    const [stønadstype, settStønadstype] = useState<Stønadstype | ''>('');
    const [feil, settFeil] = useState<string>();
    const [senderInn, settSenderInn] = useState(false);

    // Stønadstypene henger sammen med fagsystemet, så vi nullstiller valget når fagsystemet endres.
    const oppdaterFagsystem = (nyttFagsystem: Fagsystem | '') => {
        settFagsystem(nyttFagsystem);
        settStønadstype('');
    };

    const kanOpprette = ident.trim() !== '' && fagsystem !== '' && stønadstype !== '' && !senderInn;

    const opprettDummyBehandling = () => {
        if (fagsystem === '' || stønadstype === '') {
            return;
        }

        settFeil(undefined);
        settSenderInn(true);

        axiosRequest<string, DummyBehandling>({
            method: 'POST',
            url: `/familie-klage/api/test/opprett`,
            data: {
                ident: ident.trim(),
                stønadstype,
                fagsystem,
                behandlendeEnhet: utledBehandlendeEnhetForFagsystem(fagsystem),
            },
        })
            .then(resp => {
                if (resp.status === RessursStatus.SUKSESS) {
                    navigate(`/behandling/${resp.data}/formkrav`);
                } else {
                    settFeil(resp.frontendFeilmelding ?? 'Klarte ikke å opprette dummy-behandling');
                }
            })
            .finally(() => settSenderInn(false));
    };

    return (
        <Box padding={'space-40'}>
            <Heading size={'large'}>[Test] Opprett dummy-behandling</Heading>
            <VStack padding={'space-16'} gap={'space-20'} width={'25rem'}>
                <TextField
                    label={'Ident'}
                    placeholder={'Ident'}
                    value={ident}
                    onChange={e => settIdent(e.target.value)}
                />
                <Select
                    label={'Fagsystem'}
                    value={fagsystem}
                    onChange={e => oppdaterFagsystem(e.target.value as Fagsystem | '')}
                >
                    <option value={''}>Velg</option>
                    {Object.values(Fagsystem).map(fs => (
                        <option key={fs} value={fs}>
                            {fs}
                        </option>
                    ))}
                </Select>
                <Select
                    label={'Stønadstype'}
                    value={stønadstype}
                    disabled={fagsystem === ''}
                    description={fagsystem === '' ? 'Velg fagsystem først' : undefined}
                    onChange={e => settStønadstype(e.target.value as Stønadstype | '')}
                >
                    <option value={''}>Velg</option>
                    {(fagsystem === '' ? [] : stønadstyperForFagsystem[fagsystem]).map(type => (
                        <option key={type} value={type}>
                            {stønadstypeTilTekst[type]}
                        </option>
                    ))}
                </Select>
                <Button onClick={opprettDummyBehandling} disabled={!kanOpprette} loading={senderInn}>
                    Lag behandling
                </Button>
            </VStack>
            {feil && <Alert variant={'error'}>{feil}</Alert>}
        </Box>
    );
};
