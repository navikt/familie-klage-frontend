import React, { FC } from 'react';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import Visittkort from '@navikt/familie-visittkort';
import styled from 'styled-components';
import {
    Behandling,
    Klagebehandlingsårsak,
    klagebehandlingsårsakTilTekst,
    PåklagetVedtakstype,
} from '../../App/typer/fagsak';
import { ABorderStrong } from '@navikt/ds-tokens/dist/tokens';
import { Sticky } from '../Visningskomponenter/Sticky';
import { Henlegg } from './HenleggKnapp';
import { erBehandlingRedigerbar } from '../../App/typer/behandlingstatus';
import { Label, Link } from '@navikt/ds-react';
import PersonStatusVarsel from '../Varsel/PersonStatusVarsel';
import AdressebeskyttelseVarsel from '../Varsel/AdressebeskyttelseVarsel';
import { EtikettFokus, EtikettInfo, EtikettSuksess } from '../Varsel/Etikett';
import { erEtterDagensDato } from '../../App/utils/dato';
import { stønadstypeTilTekst } from '../../App/typer/stønadstype';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import {
    utledBehandlingLenke,
    utledSaksoversiktLenke,
    utledTilbakekrevingLenke,
} from '../../App/utils/utils';
import { useApp } from '../../App/context/AppContext';
import { FagsystemType } from '../../Komponenter/Behandling/Formkrav/typer';

const Visningsnavn = styled.div`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

export const Container = styled(Sticky)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 0 1rem 0 1rem;
    border-bottom: 1px solid ${ABorderStrong};
    z-index: 23;
    top: 48px; // Høyden på headeren
`;

const ElementWrapper = styled.div`
    margin-left: 1rem;
`;

const HøyreWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
`;

const TagsKnyttetTilBehandling = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
`;

const VisittkortComponent: FC<{
    personopplysninger: IPersonopplysninger;
    behandling: Behandling;
}> = ({ personopplysninger, behandling }) => {
    const { appEnv } = useApp();
    const {
        personIdent,
        kjønn,
        navn,
        folkeregisterpersonstatus,
        adressebeskyttelse,
        egenAnsatt,
        fullmakt,
        vergemål,
    } = personopplysninger;
    const skalLenkeTilFagsystemBehandling =
        behandling.påklagetVedtak.påklagetVedtakstype === PåklagetVedtakstype.VEDTAK &&
        behandling.påklagetVedtak.fagsystemVedtak?.fagsystemType === FagsystemType.ORDNIÆR;
    const skalLenkeTilTilbakekreving =
        behandling.påklagetVedtak.påklagetVedtakstype === PåklagetVedtakstype.VEDTAK &&
        behandling.påklagetVedtak.fagsystemVedtak?.fagsystemType === FagsystemType.TILBAKEKREVING;
    const behandlingLenke = utledBehandlingLenke(behandling, appEnv.eksternlenker);
    const saksoversiktLenke = utledSaksoversiktLenke(behandling, appEnv.eksternlenker);
    const tilbakekrevingLenke = utledTilbakekrevingLenke(behandling, appEnv.eksternlenker);
    const behandlingErRedigerbar = erBehandlingRedigerbar(behandling);

    return (
        <Container>
            <Visittkort
                borderBottom={false}
                alder={20}
                ident={personIdent}
                kjønn={kjønn}
                navn={
                    <Visningsnavn>
                        <Label size={'small'} as={'p'}>
                            {navn}
                        </Label>
                    </Visningsnavn>
                }
            >
                {folkeregisterpersonstatus && (
                    <ElementWrapper>
                        <PersonStatusVarsel folkeregisterpersonstatus={folkeregisterpersonstatus} />
                    </ElementWrapper>
                )}
                {adressebeskyttelse && (
                    <ElementWrapper>
                        <AdressebeskyttelseVarsel adressebeskyttelse={adressebeskyttelse} />
                    </ElementWrapper>
                )}
                {egenAnsatt && (
                    <ElementWrapper>
                        <EtikettFokus>Egen ansatt</EtikettFokus>
                    </ElementWrapper>
                )}
                {fullmakt.some(
                    (f) => f.gyldigTilOgMed === null || erEtterDagensDato(f.gyldigTilOgMed)
                ) && (
                    <ElementWrapper>
                        <EtikettFokus>Fullmakt</EtikettFokus>
                    </ElementWrapper>
                )}

                {vergemål.length > 0 && (
                    <ElementWrapper>
                        <EtikettFokus>Verge</EtikettFokus>
                    </ElementWrapper>
                )}
            </Visittkort>
            <HøyreWrapper>
                {skalLenkeTilFagsystemBehandling && (
                    <Link href={behandlingLenke} target="_blank">
                        Gå til behandling
                        <ExternalLinkIcon aria-label="Gå til behandling" fontSize={'1.375rem'} />
                    </Link>
                )}
                {skalLenkeTilTilbakekreving && (
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
                {behandling && (
                    <>
                        <TagsKnyttetTilBehandling>
                            <EtikettSuksess>
                                {stønadstypeTilTekst[behandling.stønadstype]}
                            </EtikettSuksess>
                            {behandling.årsak === Klagebehandlingsårsak.HENVENDELSE_FRA_KABAL && (
                                <EtikettInfo>
                                    {klagebehandlingsårsakTilTekst[behandling.årsak]}
                                </EtikettInfo>
                            )}
                        </TagsKnyttetTilBehandling>

                        {behandlingErRedigerbar && <Henlegg />}
                    </>
                )}
            </HøyreWrapper>
        </Container>
    );
};

export default VisittkortComponent;
