import React from 'react';
import { Behandling, behandlingResultatTilTekst } from '../../../App/typer/fagsak';
import styled from 'styled-components';
import { ABorderSubtle, ATextSubtle } from '@navikt/ds-tokens/dist/tokens';
import { BodyShort, Tooltip } from '@navikt/ds-react';
import { behandlingStatusTilTekst } from '../../../App/typer/behandlingstatus';
import { formaterIsoDato, formaterIsoDatoTid } from '../../../App/utils/formatter';
import { TilegnetSaksbehandler } from './TilegnetSaksbehandler';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useBehandling } from '../../../App/context/BehandlingContext';

const Container = styled.div`
    padding: 1rem;
    display: flex;
    gap: 0.5rem;
    border: 1px solid ${ABorderSubtle};
    border-radius: 0.125rem;
    margin: 1rem 0.5rem;
`;

const FlexBoxColumn = styled.div`
    display: flex;
    flex-direction: column;
`;

const FlexBoxColumnFullWidth = styled(FlexBoxColumn)`
    width: 100%;
    gap: 0.75rem;
`;

const GråBodyShort = styled(BodyShort)`
    color: ${ATextSubtle};
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, max-content);
    row-gap: 1rem;
    column-gap: 1.5rem;
`;

interface Props {
    behandling: Behandling;
}

export function BehandlingInfo({ behandling }: Props) {
    const { ansvarligSaksbehandler } = useBehandling();
    return (
        <DataViewer response={{ ansvarligSaksbehandler }}>
            {({ ansvarligSaksbehandler }) => {
                return (
                    <Container>
                        <FlexBoxColumnFullWidth>
                            <TilegnetSaksbehandler
                                ansvarligSaksbehandler={ansvarligSaksbehandler}
                            />
                            <Grid>
                                <FlexBoxColumn>
                                    <GråBodyShort size={'small'}>Behandlingsstatus</GråBodyShort>
                                    <BodyShort size={'small'}>
                                        {behandlingStatusTilTekst[behandling.status]}
                                    </BodyShort>
                                </FlexBoxColumn>
                                <Tooltip content={formaterIsoDatoTid(behandling.opprettet)}>
                                    <FlexBoxColumn>
                                        <GråBodyShort size={'small'}>Opprettet</GråBodyShort>
                                        <BodyShort size={'small'}>
                                            {formaterIsoDato(behandling.opprettet)}
                                        </BodyShort>
                                    </FlexBoxColumn>
                                </Tooltip>
                                <FlexBoxColumn>
                                    <GråBodyShort size={'small'}>Behandlingsresultat</GråBodyShort>
                                    <BodyShort size={'small'}>
                                        {behandlingResultatTilTekst[behandling.resultat]}
                                    </BodyShort>
                                </FlexBoxColumn>
                                <Tooltip
                                    content={formaterIsoDatoTid(behandling.sistEndret)}
                                    placement={'bottom'}
                                >
                                    <FlexBoxColumn>
                                        <GråBodyShort size={'small'}>Sist endret</GråBodyShort>
                                        <BodyShort size={'small'}>
                                            {formaterIsoDato(behandling.sistEndret)}
                                        </BodyShort>
                                    </FlexBoxColumn>
                                </Tooltip>
                                <FlexBoxColumn>
                                    <GråBodyShort size={'small'}>Behandlende enhet</GråBodyShort>
                                    <BodyShort size="small">
                                        {behandling.behandlendeEnhet}
                                    </BodyShort>
                                </FlexBoxColumn>
                            </Grid>
                        </FlexBoxColumnFullWidth>
                    </Container>
                );
            }}
        </DataViewer>
    );
}
