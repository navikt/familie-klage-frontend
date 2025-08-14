import React from 'react';
import styles from './TilegnetSaksbehandler.module.css';
import { BodyShort, HStack, VStack } from '@navikt/ds-react';
import { PersonHeadsetIcon } from '@navikt/aksel-icons';
import {
    AnsvarligSaksbehandler,
    AnsvarligSaksbehandlerRolle,
} from '../../../App/typer/saksbehandler';

interface Props {
    ansvarligSaksbehandler: AnsvarligSaksbehandler;
}

export const TilegnetSaksbehandler: React.FC<Props> = ({ ansvarligSaksbehandler }) => {
    const classNameStatusBar = utledClassNameStatusBar(ansvarligSaksbehandler?.rolle);
    const visingsnavn = utledVisningsnavn(ansvarligSaksbehandler);

    if (ansvarligSaksbehandler.rolle === AnsvarligSaksbehandlerRolle.OPPGAVE_FINNES_IKKE) {
        return null;
    }

    return (
        <>
            <HStack align="center" gap="3">
                <PersonHeadsetIcon width="3rem" height="3rem" />
                <VStack>
                    <BodyShort size={'small'} textColor="subtle">
                        Ansvarlig saksbehandler
                    </BodyShort>
                    <BodyShort size="small">{visingsnavn}</BodyShort>
                </VStack>
            </HStack>
            <span className={classNameStatusBar} />
        </>
    );
};

const utledClassNameStatusBar = (
    ansvarligSaksbehandlerRolle: AnsvarligSaksbehandlerRolle
): string => {
    switch (ansvarligSaksbehandlerRolle) {
        case AnsvarligSaksbehandlerRolle.IKKE_SATT:
        case AnsvarligSaksbehandlerRolle.UTVIKLER_MED_VEILEDERROLLE:
            return styles.statusBarNeutral;
        case AnsvarligSaksbehandlerRolle.INNLOGGET_SAKSBEHANDLER:
            return styles.statusBarSucess;
        case AnsvarligSaksbehandlerRolle.ANNEN_SAKSBEHANDLER:
        case AnsvarligSaksbehandlerRolle.OPPGAVE_TILHØRER_IKKE_ENF:
            return styles.statusBarWarning;
        default:
            return styles.statusBarNeutral;
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
