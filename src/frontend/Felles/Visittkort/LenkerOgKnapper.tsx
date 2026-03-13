import React from 'react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { HStack, Link, Stack } from '@navikt/ds-react';
import { useApp } from '../../App/context/AppContext';
import {
    Behandling,
    Klagebehandlingsårsak,
    klagebehandlingsårsakTilTekst,
    PåklagetVedtakstype,
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
import { FagsystemType } from '../../Komponenter/Behandling/Formkrav/typer';

interface Props {
    behandling: Behandling;
}

export const LenkerOgKnapper = ({ behandling }: Props) => {
    const { appEnv } = useApp();

    const skalLenkeTilFagsystemBehandling =
        behandling.påklagetVedtak.påklagetVedtakstype === PåklagetVedtakstype.VEDTAK &&
        behandling.påklagetVedtak.fagsystemVedtak?.fagsystemType === FagsystemType.ORDNIÆR;
    const skalLenkeTilTilbakekreving =
        behandling.påklagetVedtak.påklagetVedtakstype === PåklagetVedtakstype.VEDTAK &&
        behandling.påklagetVedtak.fagsystemVedtak?.fagsystemType === FagsystemType.TILBAKEKREVING;
    const behandlingLenke = utledBehandlingLenke(behandling, appEnv.eksternlenker);
    const saksoversiktLenke = utledSaksoversiktLenke(behandling, appEnv.eksternlenker);
    const tilbakekrevingLenke = utledTilbakekrevingLenke(behandling, appEnv.eksternlenker);

    return (
        <HStack align={'center'} justify={'start'} gap={'space-8'} padding={'space-8'}>
            {skalLenkeTilFagsystemBehandling && (
                <Link href={behandlingLenke} target="_blank">
                    Gå til behandling
                    <ExternalLinkIcon aria-label="Gå til behandling" fontSize={'1.375rem'} />
                </Link>
            )}
            {skalLenkeTilTilbakekreving && (
                <Link href={tilbakekrevingLenke} target="_blank">
                    Gå til tilbakekreving
                    <ExternalLinkIcon aria-label="Gå til tilbakekreving" fontSize={'1.375rem'} />
                </Link>
            )}
            <Link href={saksoversiktLenke} target="_blank">
                Gå til saksoversikt
                <ExternalLinkIcon aria-label="Gå til saksoversikt" fontSize={'1.375rem'} />
            </Link>
            {behandling && (
                <Stack direction={'row'} gap={'space-8'}>
                    <HStack justify={'end'} gap={'space-8'}>
                        <EtikettSuksess>
                            {stønadstypeTilTekst[behandling.stønadstype]}
                        </EtikettSuksess>
                        {behandling.årsak === Klagebehandlingsårsak.HENVENDELSE_FRA_KABAL && (
                            <EtikettInfo>
                                {klagebehandlingsårsakTilTekst[behandling.årsak]}
                            </EtikettInfo>
                        )}
                    </HStack>
                    <SettPåVentKnapp />
                    <EndreBehandlendeEnhetKnapp fagsystem={behandling.fagsystem} />
                    <HenleggKnapp />
                </Stack>
            )}
        </HStack>
    );
};
