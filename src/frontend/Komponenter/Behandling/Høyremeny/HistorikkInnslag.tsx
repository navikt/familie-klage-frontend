import * as React from 'react';
import { NavdsSemanticColorBorder } from '@navikt/ds-tokens/dist/tokens';
import { BodyShort, Detail, Label } from '@navikt/ds-react';
import styled from 'styled-components';
import { formaterIsoDatoTid } from '../../../App/utils/formatter';
import { Behandling, behandlingStegFullførtTilTekst, StegType } from '../../../App/typer/fagsak';
import { PeopleInCircle } from '@navikt/ds-icons';
import { utledTekstForTidslinje } from '../utils';

const Innslag = styled.div`
    display: flex;
    margin: 1rem 1.6rem;
`;

const Ikon = styled.div`
    display: block;
`;

const StipletLinje = styled.div`
    border-left: 0.15rem dotted ${NavdsSemanticColorBorder};
    margin-top: 0.5rem;
    margin-left: 0.75rem;
    height: 1.5rem;
`;

const Tekst = styled.div`
    margin-left: 0.7rem;
`;

interface IHistorikkOppdatering {
    behandling: Behandling;
    steg?: StegType;
    opprettetAv: string;
    endretTid: string;
    opprettet: boolean;
}

const HistorikkInnslag: React.FunctionComponent<IHistorikkOppdatering> = ({
    behandling,
    steg,
    opprettetAv,
    endretTid,
    opprettet,
}) => {
    return (
        <Innslag>
            <Ikon>
                <PeopleInCircle width={26} height={26} />
                <StipletLinje />
            </Ikon>
            <Tekst>
                {opprettet || !steg ? (
                    <Label size="small">Behandling er opprettet</Label>
                ) : (
                    <Label size="small">{behandlingStegFullførtTilTekst[steg]}</Label>
                )}
                {steg && <BodyShort>{utledTekstForTidslinje(behandling, steg)}</BodyShort>}
                <Detail size="small">
                    {formaterIsoDatoTid(endretTid)} | {opprettetAv}
                </Detail>
            </Tekst>
        </Innslag>
    );
};

export default HistorikkInnslag;
