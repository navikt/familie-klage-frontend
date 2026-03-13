import React from 'react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { HStack, Link } from '@navikt/ds-react';
import { useApp } from '../../App/context/AppContext';
import {
    Behandling,
    Klagebehandlingsårsak,
    klagebehandlingsårsakTilTekst,
} from '../../App/typer/fagsak';
import {
    utledBehandlingLenke,
    utledSaksoversiktLenke,
    utledTilbakekrevingLenke,
} from '../../App/utils/utils';
import { EtikettInfo, EtikettSuksess } from '../Varsel/Etikett';
import { stønadstypeTilTekst } from '../../App/typer/stønadstype';
import { SettPåVentKnapp } from './SettPåVentKnapp';
import { EndreBehandlendeEnhetKnapp } from './EndreBehandlendeEnhetKnapp';
import { HenleggKnapp } from './HenleggKnapp';

interface Props {
    behandling: Behandling;
}

export const LenkerOgKnapper = ({ behandling }: Props) => {
    const { appEnv } = useApp();

    const behandlingLenke = utledBehandlingLenke(behandling, appEnv.eksternlenker);
    const saksoversiktLenke = utledSaksoversiktLenke(behandling, appEnv.eksternlenker);
    const tilbakekrevingLenke = utledTilbakekrevingLenke(behandling, appEnv.eksternlenker);

    return (
        <HStack
            align={'center'}
            justify={'end'}
            gap={'space-8 space-12'}
            style={{ whiteSpace: 'nowrap' }}
        >
            <HStack align={'center'} gap={'space-8 space-12'} wrap={false}>
                {behandlingLenke && (
                    <Link href={behandlingLenke} target="_blank">
                        Gå til behandling
                        <ExternalLinkIcon aria-label="Gå til behandling" fontSize={'1.375rem'} />
                    </Link>
                )}
                {tilbakekrevingLenke && (
                    <Link href={tilbakekrevingLenke} target="_blank">
                        Gå til tilbakekreving
                        <ExternalLinkIcon
                            aria-label="Gå til tilbakekreving"
                            fontSize={'1.375rem'}
                        />
                    </Link>
                )}
                <Link href={saksoversiktLenke} target="_blank">
                    Gå til saksoversikt
                    <ExternalLinkIcon aria-label="Gå til saksoversikt" fontSize={'1.375rem'} />
                </Link>
            </HStack>
            {behandling && (
                <HStack align={'center'} gap={'space-8 space-12'} wrap={false}>
                    <EtikettSuksess>{stønadstypeTilTekst[behandling.stønadstype]}</EtikettSuksess>
                    {behandling.årsak === Klagebehandlingsårsak.HENVENDELSE_FRA_KABAL && (
                        <EtikettInfo>{klagebehandlingsårsakTilTekst[behandling.årsak]}</EtikettInfo>
                    )}
                    <SettPåVentKnapp />
                    <EndreBehandlendeEnhetKnapp fagsystem={behandling.fagsystem} />
                    <HenleggKnapp />
                </HStack>
            )}
        </HStack>
    );
};
