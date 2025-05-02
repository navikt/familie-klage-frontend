import React from 'react';
import styled from 'styled-components';
import { BodyShort } from '@navikt/ds-react';
import { PersonHeadsetIcon } from '@navikt/aksel-icons';

import {
    ASurfaceNeutral,
    ASurfaceSuccess,
    ASurfaceWarning,
    ATextSubtle,
} from '@navikt/ds-tokens/dist/tokens';
import {
    AnsvarligSaksbehandler,
    AnsvarligSaksbehandlerRolle,
} from '../../../App/typer/saksbehandler';

const FlexBoxColumn = styled.div`
    display: flex;
    flex-direction: column;
`;

const FlexBoxRow = styled.div`
    align-items: center;
    display: flex;
    gap: 0.75rem;
`;

const GråBodyShort = styled(BodyShort)`
    color: ${ATextSubtle};
`;

const PersonIkon = styled(PersonHeadsetIcon)`
    width: 3rem;
    height: 3rem;
`;

const StatusBar = styled.span<{ $color: string }>`
    width: 100%;
    border-top: 4px solid ${(props) => props.$color};
`;

interface Props {
    ansvarligSaksbehandler: AnsvarligSaksbehandler;
}

function utledStatusbarFarge(ansvarligSaksbehandlerRolle: AnsvarligSaksbehandlerRolle): string {
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
}

function utledVisningsnavn(ansvarligSaksbehandler: AnsvarligSaksbehandler): string {
    switch (ansvarligSaksbehandler.rolle) {
        case AnsvarligSaksbehandlerRolle.INNLOGGET_SAKSBEHANDLER:
        case AnsvarligSaksbehandlerRolle.ANNEN_SAKSBEHANDLER:
            return `${ansvarligSaksbehandler.fornavn} ${ansvarligSaksbehandler.etternavn}`;
        case AnsvarligSaksbehandlerRolle.UTVIKLER_MED_VEILEDERROLLE:
            return 'ingen tilgang';
        default:
            return 'ingen ansvarlig';
    }
}

export function TilegnetSaksbehandler({ ansvarligSaksbehandler }: Props) {
    const statusBarFarge = utledStatusbarFarge(ansvarligSaksbehandler?.rolle);
    const visingsnavn = utledVisningsnavn(ansvarligSaksbehandler);

    if (ansvarligSaksbehandler.rolle === AnsvarligSaksbehandlerRolle.OPPGAVE_FINNES_IKKE) {
        return null;
    }

    return (
        <>
            <FlexBoxRow>
                <PersonIkon />
                <FlexBoxColumn>
                    <GråBodyShort size={'small'}>Ansvarlig saksbehandler</GråBodyShort>
                    <BodyShort size="small">{visingsnavn}</BodyShort>
                </FlexBoxColumn>
            </FlexBoxRow>
            <StatusBar $color={statusBarFarge} />
        </>
    );
}
