import * as React from 'react';
import styled from 'styled-components';
import { BodyShort, Tooltip } from '@navikt/ds-react';
import { behandlingStatusTilTekst } from '../../../App/typer/behandlingstatus';
import { Behandling, behandlingResultatTilTekst } from '../../../App/typer/fagsak';
import { formaterIsoDato, formaterIsoDatoTid } from '../../../App/utils/formatter';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { PersonHeadsetIcon } from '@navikt/aksel-icons';

import {
    ABorderSubtle,
    ASurfaceNeutral,
    ASurfaceSuccess,
    ASurfaceWarning,
    ATextSubtle,
} from '@navikt/ds-tokens/dist/tokens';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import {
    AnsvarligSaksbehandlerRolle,
    AnsvarligSaksbehandler,
} from '../../../App/typer/saksbehandler';

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

const FlexBoxRow = styled.div`
    align-items: center;
    display: flex;
    gap: 0.75rem;
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

const PersonIkon = styled(PersonHeadsetIcon)`
    width: 3rem;
    height: 3rem;
`;

interface Props {
    behandling: Behandling;
}

const TilegnetSaksbehandler: React.FC<Props> = ({ behandling }) => {
    const { ansvarligSaksbehandler } = useBehandling();

    const utledStatusbarFarge = (
        ansvarligSaksbehandlerRolle: AnsvarligSaksbehandlerRolle
    ): string => {
        switch (ansvarligSaksbehandlerRolle) {
            case AnsvarligSaksbehandlerRolle.IKKE_SATT:
            case AnsvarligSaksbehandlerRolle.UTVIKLER_MED_VEILEDERROLLE:
                return ASurfaceNeutral;
            case AnsvarligSaksbehandlerRolle.INNLOGGET_SAKSBEHANDLER:
                return ASurfaceSuccess;
            case AnsvarligSaksbehandlerRolle.ANNEN_SAKSBEHANDLER:
            case AnsvarligSaksbehandlerRolle.OPPGAVE_TILHØRER_IKKE_ENF:
                return ASurfaceWarning;
            default:
                return ASurfaceNeutral;
        }
    };

    const utledVisningsnavn = (ansvarligSaksbehandler: AnsvarligSaksbehandler): string => {
        switch (ansvarligSaksbehandler.rolle) {
            case AnsvarligSaksbehandlerRolle.INNLOGGET_SAKSBEHANDLER:
            case AnsvarligSaksbehandlerRolle.ANNEN_SAKSBEHANDLER:
                return `${ansvarligSaksbehandler.fornavn} ${ansvarligSaksbehandler.etternavn}`;
            case AnsvarligSaksbehandlerRolle.UTVIKLER_MED_VEILEDERROLLE:
                return 'ingen tilgang';
            default:
                return 'ingen ansvarlig';
        }
    };

    const StatusBar = styled.span<{ $color: string }>`
        width: 100%;
        border-top: 4px solid ${(props) => props.$color};
    `;

    return (
        <DataViewer response={{ ansvarligSaksbehandler }}>
            {({ ansvarligSaksbehandler }) => {
                const statusBarFarge = utledStatusbarFarge(ansvarligSaksbehandler?.rolle);
                const visingsnavn = utledVisningsnavn(ansvarligSaksbehandler);

                const skalViseAnsvarligSaksbehandler =
                    ansvarligSaksbehandler.rolle !==
                    AnsvarligSaksbehandlerRolle.OPPGAVE_FINNES_IKKE;

                return (
                    <Container>
                        <FlexBoxColumnFullWidth>
                            {skalViseAnsvarligSaksbehandler && (
                                <>
                                    <FlexBoxRow>
                                        <PersonIkon />
                                        <FlexBoxColumn>
                                            <GråBodyShort size={'small'}>
                                                Ansvarlig saksbehandler
                                            </GråBodyShort>
                                            <BodyShort size="small">{visingsnavn}</BodyShort>
                                        </FlexBoxColumn>
                                    </FlexBoxRow>
                                    <StatusBar $color={statusBarFarge} />
                                </>
                            )}
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
                            </Grid>
                        </FlexBoxColumnFullWidth>
                    </Container>
                );
            }}
        </DataViewer>
    );
};

export default TilegnetSaksbehandler;
