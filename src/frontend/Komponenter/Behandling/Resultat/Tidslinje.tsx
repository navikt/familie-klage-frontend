import * as React from 'react';
import { IBehandlingshistorikk } from '../Høyremeny/behandlingshistorikk';
import {
    Behandling,
    BehandlingResultat,
    behandlingStegTilTekst,
    revurderingIkkeOpprettetÅrsak,
    StegType,
} from '../../../App/typer/fagsak';
import styles from './Tidslinje.module.css';
import { Button, Detail, Heading, Label, VStack } from '@navikt/ds-react';
import { formaterIsoDato, formaterIsoKlokke } from '../../../App/utils/formatter';
import { ClockIcon } from '@navikt/aksel-icons';
import { utledStegutfallForFerdigstiltBehandling } from '../utils';
import { fjernDuplikatStegFraHistorikk } from './utils';
import { useApp } from '../../../App/context/AppContext';
import { utledEksternBehandlingLenke, utledSaksoversiktLenke } from '../../../App/utils/utils';
import Oppfylt from '../../../Felles/Ikoner/Oppfylt';
import Advarsel from '../../../Felles/Ikoner/Advarsel';
import Info from '../../../Felles/Ikoner/Info';

/**
 * Hvis resultat = HENLAGT, vis kun opprettet og ferdigstilt
 * Hvis Resultat = IKKE_MEDHOLD_FORMKRAV_AVVIST, ikke vis vurdering, for å unngå at man først oppfylt krav, lagt inn vurdering, ikke oppfylt krav, ferdigstilt
 */
const filtrerResutatSteg = (
    behandlingHistorikk: IBehandlingshistorikk[],
    behandling: Behandling
) => {
    let historikk = fjernDuplikatStegFraHistorikk(behandlingHistorikk);
    if (behandling.resultat === BehandlingResultat.HENLAGT) {
        historikk = historikk.filter(
            (steg) =>
                steg.steg === StegType.OPPRETTET || steg.steg === StegType.BEHANDLING_FERDIGSTILT
        );
    }
    if (behandling.resultat === BehandlingResultat.IKKE_MEDHOLD_FORMKRAV_AVVIST) {
        historikk = historikk.filter((steg) => steg.steg !== StegType.VURDERING);
    }
    return historikk;
};

export const Tidslinje: React.FC<{
    behandling: Behandling;
    behandlingHistorikk: IBehandlingshistorikk[];
}> = ({ behandling, behandlingHistorikk }) => {
    const historikk = filtrerResutatSteg(behandlingHistorikk, behandling);

    const harFåttMedhold = behandling.resultat === BehandlingResultat.MEDHOLD;
    return (
        <div className={styles.container}>
            {historikk.map((steg, index) => {
                return (
                    <div className={styles.historikkInnslag} key={index}>
                        <div
                            className={
                                index > 0 ? styles.linjeSortSynlig : styles.linjeSortTransparent
                            }
                        />
                        <Node behandling={behandling} steg={steg} />
                        {index + 1 < historikk.length && <div className={styles.linjeSortSynlig} />}
                        {harFåttMedhold && index + 1 === historikk.length && (
                            <div className={styles.linjeStiplet} />
                        )}
                    </div>
                );
            })}
            {harFåttMedhold && (
                <div className={styles.alertContainer}>
                    <div className={styles.linjeStiplet} />
                    <VStack className={styles.nodeContainer}>
                        <Heading className={styles.heading} level="1" size="xsmall">
                            Revurdering
                        </Heading>
                        <MedholdRevurdering behandling={behandling} />
                    </VStack>
                </div>
            )}
        </div>
    );
};

const Node: React.FC<{
    behandling: Behandling;
    steg: IBehandlingshistorikk;
}> = ({ behandling, steg }) => {
    const tittelErToLinjer =
        steg.steg === StegType.OVERFØRING_TIL_KABAL || steg.steg === StegType.KABAL_VENTER_SVAR;

    return (
        <VStack className={styles.nodeContainer}>
            <Heading
                className={tittelErToLinjer ? styles.headingSpacing : styles.heading}
                level="1"
                size="xsmall"
            >
                {behandlingStegTilTekst[steg.steg]}
            </Heading>
            {steg.endretTid ? (
                <Oppfylt className={styles.suksessIkon} width={36} height={36} />
            ) : (
                <ClockIcon fontSize="2.25rem" />
            )}
            <Detail>{steg.endretTid && formaterIsoDato(steg.endretTid)}</Detail>
            <Detail>{steg.endretTid && formaterIsoKlokke(steg.endretTid)}</Detail>
            <Label size="small">
                {utledStegutfallForFerdigstiltBehandling(behandling, steg.steg)}
            </Label>
        </VStack>
    );
};

export const MedholdRevurdering: React.FC<{
    behandling: Behandling;
}> = ({ behandling }) => {
    const { appEnv } = useApp();
    const { fagsystemRevurdering } = behandling;
    if (fagsystemRevurdering?.opprettetBehandling) {
        const { eksternBehandlingId, opprettetTid } = fagsystemRevurdering.opprettet;
        return (
            <>
                <Info width={36} height={36} />
                <Detail size="small">{formaterIsoDato(opprettetTid)}</Detail>
                <Detail size="small">{formaterIsoKlokke(opprettetTid)}</Detail>
                <Label size={'small'}>Automatisk opprettet</Label>
                <Button
                    as={'a'}
                    variant={'secondary'}
                    size={'small'}
                    href={utledEksternBehandlingLenke(
                        behandling,
                        eksternBehandlingId,
                        appEnv.eksternlenker
                    )}
                >
                    Åpne revurdering
                </Button>
            </>
        );
    } else {
        return (
            <>
                <Advarsel width={36} height={36} />
                <Label size={'small'}>Må manuelt opprettes</Label>
                {fagsystemRevurdering && (
                    <Detail size="small">
                        Årsak:{' '}
                        {revurderingIkkeOpprettetÅrsak[fagsystemRevurdering.ikkeOpprettet.årsak]}
                    </Detail>
                )}
                <Button
                    as={'a'}
                    variant={'secondary'}
                    size={'small'}
                    href={utledSaksoversiktLenke(behandling, appEnv.eksternlenker)}
                >
                    Gå til behandlingsoversikt
                </Button>
            </>
        );
    }
};
