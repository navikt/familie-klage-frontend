import React, { FC, useState } from 'react';
import styled from 'styled-components';
import {
    Behandling,
    behandlingResultatTilTekst,
    behandlingStegTilTekst,
} from '../../App/typer/fagsak';
import { Menyknapp } from 'nav-frontend-ikonknapper';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import { formaterIsoDatoTid } from '../../App/utils/formatter';
import { behandlingStatusTilTekst } from '../../App/typer/behandlingstatus';
import navFarger from 'nav-frontend-core';
import { BodyShort } from '@navikt/ds-react';

const BehandlingsinfoWrapper = styled.div`
    margin: auto;
    padding-right: 0.25rem;
`;

const PopoverInnehold = styled.div`
    padding: 1rem;
`;

const PopoverTabell = styled.div`
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    margin-bottom: 0.75rem;

    > * {
        margin: 0.25rem 0;
    }
`;

const GråTekst = styled(BodyShort)`
    color: ${navFarger.navGra60};
`;

const StyledMenyKnapp = styled(Menyknapp)`
    text-transform: none;
`;

const popoverId = 'visBehandlingsinfo-popover';

const Behandlingsinfo: FC<{ behandling: Behandling }> = ({ behandling }) => {
    const [anker, settAnker] = useState<HTMLButtonElement>();

    const togglePopover = (nyAnker: HTMLButtonElement | undefined) => {
        settAnker(anker ? undefined : nyAnker);
    };

    return (
        <BehandlingsinfoWrapper>
            <StyledMenyKnapp
                id="visBehandlingsinfo"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => togglePopover(e.currentTarget)}
                aria-expanded={anker !== undefined}
                aria-controls={popoverId}
                aria-haspopup="menu"
            ></StyledMenyKnapp>
            <Popover
                id={popoverId}
                ankerEl={anker}
                onRequestClose={() => settAnker(undefined)}
                orientering={PopoverOrientering.Under}
                autoFokus={false}
                tabIndex={-1}
                utenPil
            >
                <PopoverInnehold>
                    <PopoverTabell>
                        <GråTekst>Behandlingsstatus</GråTekst>
                        <BodyShort>{behandlingStatusTilTekst[behandling.status]}</BodyShort>

                        <GråTekst>Behandlingsresultat</GråTekst>
                        <BodyShort>{behandlingResultatTilTekst[behandling.resultat]}</BodyShort>

                        <GråTekst>Opprettet</GråTekst>
                        <BodyShort>{formaterIsoDatoTid(behandling.opprettet)}</BodyShort>

                        <GråTekst>Sist endret</GråTekst>
                        <BodyShort>{formaterIsoDatoTid(behandling.sistEndret)}</BodyShort>

                        <GråTekst>Steg</GråTekst>
                        <BodyShort>{behandlingStegTilTekst[behandling.steg]}</BodyShort>
                    </PopoverTabell>
                    <GråTekst>Id: {behandling.id}</GråTekst>
                </PopoverInnehold>
            </Popover>
        </BehandlingsinfoWrapper>
    );
};

export default Behandlingsinfo;
