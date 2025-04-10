/* eslint-disable react/prop-types */
import * as React from 'react';
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
    AnsvarligSaksbehandlerRolle,
    AnsvarligSaksbehandler,
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

interface IProps {
    ansvarligSaksbehandler: AnsvarligSaksbehandler;
}

const TilegnetSaksbehandler: React.FC<IProps> = ({ ansvarligSaksbehandler }: IProps) => {
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

    const statusBarFarge = utledStatusbarFarge(ansvarligSaksbehandler?.rolle);
    const visingsnavn = utledVisningsnavn(ansvarligSaksbehandler);

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
};

export default TilegnetSaksbehandler;
