import React from 'react';
import { useApp } from '../../../../../App/context/AppContext';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { Alert, BodyShort, Button, Label, Tooltip } from '@navikt/ds-react';
import styled from 'styled-components';
import { Brevmottaker, utledNavnPåMottakere } from '../brevmottaker';

const InfoHeader = styled.div`
    display: grid;
    grid-template-columns: 26rem 12rem;
`;

type Props = {
    brevmottakere: Brevmottaker[];
};

export function BrevmottakereOppsumering({ brevmottakere }: Props) {
    const { settVisBrevmottakereModal } = useApp();
    const { behandlingErRedigerbar } = useBehandling();

    const navn = utledNavnPåMottakere(brevmottakere);

    return (
        <Alert variant={'info'}>
            <InfoHeader>
                <Label>Brevmottakere:</Label>
                {behandlingErRedigerbar && (
                    <Tooltip content={'Legg til verge eller fullmektige brevmottakere'}>
                        <Button
                            variant={'tertiary'}
                            onClick={() => settVisBrevmottakereModal(true)}
                        >
                            Legg til/endre brevmottakere
                        </Button>
                    </Tooltip>
                )}
            </InfoHeader>
            <ul>
                {navn.map((navn, index) => (
                    <li key={navn + index}>
                        <BodyShort key={navn + index}>{navn}</BodyShort>
                    </li>
                ))}
            </ul>
        </Alert>
    );
}
