import { BodyShort, HStack, Tooltip, VStack } from '@navikt/ds-react';
import React from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { behandlingStatusTilTekst } from '../../../App/typer/behandlingstatus';
import type { Behandling } from '../../../App/typer/fagsak';
import { behandlingResultatTilTekst } from '../../../App/typer/fagsak';
import { formaterIsoDato, formaterIsoDatoTid } from '../../../App/utils/formatter';
import { DataViewer } from '../../../Felles/DataViewer/DataViewer';
import styles from './BehandlingInfo.module.css';
import { TilegnetSaksbehandler } from './TilegnetSaksbehandler';

interface Props {
    behandling: Behandling;
}

export const BehandlingInfo: React.FC<Props> = ({ behandling }) => {
    const { ansvarligSaksbehandler } = useBehandling();

    return (
        <DataViewer response={{ ansvarligSaksbehandler }}>
            {({ ansvarligSaksbehandler }) => (
                <HStack padding="space-16" gap="space-8" className={styles.container}>
                    <HStack gap="space-12" width="100%">
                        <TilegnetSaksbehandler ansvarligSaksbehandler={ansvarligSaksbehandler} />
                        <div className={styles.grid}>
                            <VStack>
                                <BodyShort size={'small'} textColor="subtle">
                                    Behandlingsstatus
                                </BodyShort>
                                <BodyShort size={'small'}>
                                    {behandlingStatusTilTekst[behandling.status]}
                                </BodyShort>
                            </VStack>
                            <Tooltip content={formaterIsoDatoTid(behandling.opprettet)}>
                                <VStack>
                                    <BodyShort size={'small'} textColor="subtle">
                                        Opprettet
                                    </BodyShort>
                                    <BodyShort size={'small'}>
                                        {formaterIsoDato(behandling.opprettet)}
                                    </BodyShort>
                                </VStack>
                            </Tooltip>
                            <VStack>
                                <BodyShort size={'small'} textColor="subtle">
                                    Behandlingsresultat
                                </BodyShort>
                                <BodyShort size={'small'}>
                                    {behandlingResultatTilTekst[behandling.resultat]}
                                </BodyShort>
                            </VStack>
                            <Tooltip
                                content={formaterIsoDatoTid(behandling.sistEndret)}
                                placement={'bottom'}
                            >
                                <VStack>
                                    <BodyShort size={'small'} textColor="subtle">
                                        Sist endret
                                    </BodyShort>
                                    <BodyShort size={'small'}>
                                        {formaterIsoDato(behandling.sistEndret)}
                                    </BodyShort>
                                </VStack>
                            </Tooltip>
                            <VStack>
                                <BodyShort size={'small'} textColor="subtle">
                                    Behandlende enhet
                                </BodyShort>
                                <BodyShort size="small">{behandling.behandlendeEnhet}</BodyShort>
                            </VStack>
                        </div>
                    </HStack>
                </HStack>
            )}
        </DataViewer>
    );
};
