import React, { FC } from 'react';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import Visittkort from '@navikt/familie-visittkort';
import styled from 'styled-components';
import { Behandling } from '../../App/typer/fagsak';
import { ABorderStrong } from '@navikt/ds-tokens/dist/tokens';
import { Sticky } from '../Visningskomponenter/Sticky';
import { Henlegg } from './HenleggKnapp';
import { erBehandlingRedigerbar } from '../../App/typer/behandlingstatus';
import { Label } from '@navikt/ds-react';
import PersonStatusVarsel from '../Varsel/PersonStatusVarsel';
import AdressebeskyttelseVarsel from '../Varsel/AdressebeskyttelseVarsel';
import { EtikettFokus, EtikettSuksess } from '../Varsel/Etikett';
import { erEtterDagensDato } from '../../App/utils/dato';
import { stønadstypeTilTekst } from '../../App/typer/stønadstype';

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

const TagsKnyttetTilBehandling = styled.div`
    display: flex;
    justify-content: flex-end;
    flex-grow: 1;
`;

const VisittkortComponent: FC<{
    personopplysninger: IPersonopplysninger;
    behandling: Behandling;
}> = ({ personopplysninger, behandling }) => {
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
                {fullmakt.some((f) => erEtterDagensDato(f.gyldigTilOgMed)) && (
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

            {behandling && (
                <>
                    <TagsKnyttetTilBehandling>
                        <EtikettSuksess>
                            {stønadstypeTilTekst[behandling.stønadstype]}
                        </EtikettSuksess>
                    </TagsKnyttetTilBehandling>

                    {erBehandlingRedigerbar(behandling) && <Henlegg />}
                </>
            )}
        </Container>
    );
};

export default VisittkortComponent;
