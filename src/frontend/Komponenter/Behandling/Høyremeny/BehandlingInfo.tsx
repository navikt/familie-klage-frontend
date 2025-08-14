import React from 'react';
import { Behandling, behandlingResultatTilTekst } from '../../../App/typer/fagsak';
import styles from './BehandlingInfo.module.css';
import { BodyShort, HStack, Tooltip, VStack } from '@navikt/ds-react';
import { behandlingStatusTilTekst } from '../../../App/typer/behandlingstatus';
import { formaterIsoDato, formaterIsoDatoTid } from '../../../App/utils/formatter';
import { TilegnetSaksbehandler } from './TilegnetSaksbehandler';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useBehandling } from '../../../App/context/BehandlingContext';

interface Props {
    behandling: Behandling;
}

export const BehandlingInfo: React.FC<Props> = ({ behandling }) => {
    const { ansvarligSaksbehandler } = useBehandling();

    return (
        <DataViewer response={{ ansvarligSaksbehandler }}>
            {({ ansvarligSaksbehandler }) => (
                <HStack padding="4" gap="2" className={styles.container}>
                    <HStack gap="3" width="100%">
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
