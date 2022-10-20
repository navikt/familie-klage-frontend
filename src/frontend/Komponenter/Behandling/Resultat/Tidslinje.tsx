import * as React from 'react';
import { IBehandlingshistorikk } from '../Høyremeny/behandlingshistorikk';
import { Behandling, behandlingStegTilTekst } from '../../../App/typer/fagsak';
import styled from 'styled-components';
import { BodyShort, Detail, Heading, Label } from '@navikt/ds-react';
import { formaterIsoDato, formaterIsoKlokke } from '../../../App/utils/formatter';
import { Clock, SuccessColored } from '@navikt/ds-icons';
import { KlagehendelseType } from '../../../App/typer/klageresultat';
import { utledStegutfall } from '../utils';
import { fjernDuplikatStegFraHistorikk } from './utils';

const Flexbox = styled.div`
    display: flex;
    @media (max-width: 1400px) {
        flex-direction: column;
        justify-content: center;
    }
    @media (min-width: 1400px) {
        flex-direction: row;
    }
`;

const HistorikkInnslag = styled.div`
    @media (max-width: 1400px) {
        width: 10rem;
    }
    @media (min-width: 1400px) {
        flex-grow: 1;
        display: grid;
        grid-template-columns: auto 5rem auto;
    }
`;

const LinjeSort = styled.div<{ synlig: boolean }>`
    @media (max-width: 1400px) {
        ${(props) => (props.synlig ? '' : 'transparent')}
        border-left: 2px solid black;
        margin-left: 5rem;
        height: 2rem;
    }
    @media (min-width: 1400px) {
        border-top: 2px solid ${(props) => (props.synlig ? 'black' : 'transparent')};
        margin-top: 3.25rem;
        min-width: 3rem;
    }
`;

const NodeContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-self: flex-start;
    text-align: center;
    white-space: nowrap;
    align-items: center;
`;

const Tittel = styled(Heading)`
    margin-bottom: 0.75rem;
`;

const Suksess = styled(SuccessColored)`
    margin: auto;
    margin-bottom: 0.5rem;
`;

export const Tidslinje: React.FC<{
    behandling: Behandling;
    behandlingHistorikk: IBehandlingshistorikk[];
}> = ({ behandling, behandlingHistorikk }) => {
    const historikk = fjernDuplikatStegFraHistorikk(behandlingHistorikk);
    // TODO: sorter eksternutfall med generisk funksjon
    // const { sortertListe, settSortering, sortConfig } = useSorteringState<GamleBehandlingerTabell>(
    //     gamleBehandlinger,
    //     {
    //         sorteringsfelt: 'opprettet',
    //         rekkefolge: 'ascending',
    //     }
    // );

    return (
        <>
            <Flexbox>
                {historikk.map((steg, index) => (
                    <HistorikkInnslag key={index}>
                        <LinjeSort synlig={index > 0} />
                        <Node behandling={behandling} steg={steg} />
                        <LinjeSort synlig={index + 1 < historikk.length} />
                    </HistorikkInnslag>
                ))}
            </Flexbox>
            <AnkeInfo behandling={behandling} />
        </>
    );
};
const AnkeInfo: React.FC<{ behandling: Behandling }> = ({ behandling }) => {
    const resultatUtenKlagebehandlinger = behandling.klageresultat.filter(
        (resultat) => resultat.type != KlagehendelseType.KLAGEBEHANDLING_AVSLUTTET
    );
    return (
        <>
            {resultatUtenKlagebehandlinger.map((res) => (
                <>
                    <Label>{res.type}</Label>
                    <BodyShort> {res.mottattEllerAvsluttetTidspunkt} </BodyShort>
                    <BodyShort> {res.utfall} </BodyShort>
                </>
            ))}
        </>
    );
};
const Node: React.FC<{ behandling: Behandling; steg: IBehandlingshistorikk }> = ({
    behandling,
    steg,
}) => {
    return (
        <NodeContainer>
            <Tittel level="1" size="xsmall">
                {behandlingStegTilTekst[steg.steg]}
            </Tittel>
            {steg.endretTid ? <Suksess width={36} height={36} /> : <Clock width={36} height={36} />}
            <Detail size="small">{steg.endretTid && formaterIsoDato(steg.endretTid)}</Detail>
            <Detail size="small">{steg.endretTid && formaterIsoKlokke(steg.endretTid)}</Detail>
            <Label size={'small'}>{utledStegutfall(behandling, steg.steg)}</Label>
        </NodeContainer>
    );
};
