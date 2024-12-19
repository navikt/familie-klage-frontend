import React, { useState } from 'react';
import { useApp } from '../../../../App/context/AppContext';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { byggTomRessurs, Ressurs } from '../../../../App/typer/ressurs';
import { BrevmottakerModal } from './modal/BrevmottakerModal';
import { BrevmottakerPanel } from './panel/BrevmottakerPanel';
import { Brevmottaker } from './brevmottaker';
import { OpprettBrevmottakerDto } from './opprettBrevmottakerDto';
import { useOnMount } from '../../../../App/hooks/useOnMount';

const API_BASE_URL = `/familie-klage/api/brevmottaker`;

type Props = {
    behandlingId: string;
};

export function BrevmottakerContainer({ behandlingId }: Props) {
    const { axiosRequest } = useApp();
    const { personopplysningerResponse: personopplysninger } = useBehandling();
    const [brevmottakere, settBrevmottakere] = useState<Ressurs<Brevmottaker[]>>(byggTomRessurs());

    function hentBrevmottakere() {
        axiosRequest<Brevmottaker[], null>({
            method: 'GET',
            url: `${API_BASE_URL}/${behandlingId}`,
        }).then((ressurs: Ressurs<Brevmottaker[]>) => settBrevmottakere(ressurs));
    }

    function opprettBrevmottaker(opprettBrevmottakerDto: OpprettBrevmottakerDto) {
        axiosRequest<Brevmottaker[], OpprettBrevmottakerDto>({
            url: `${API_BASE_URL}/${behandlingId}`,
            method: 'POST',
            data: opprettBrevmottakerDto,
        }).then((ressurs: Ressurs<Brevmottaker[]>) => settBrevmottakere(ressurs));
    }

    function slettBrevmottakere(brevmottakerId: string) {
        axiosRequest<Brevmottaker[], null>({
            method: 'DELETE',
            url: `${API_BASE_URL}/${behandlingId}/${brevmottakerId}`,
        }).then((ressurs: Ressurs<Brevmottaker[]>) => settBrevmottakere(ressurs));
    }

    useOnMount(() => hentBrevmottakere());

    return (
        <DataViewer response={{ brevmottakere, personopplysninger }}>
            {({ brevmottakere, personopplysninger }) => (
                <>
                    <BrevmottakerPanel brevmottakere={brevmottakere} />
                    <BrevmottakerModal
                        behandlingId={behandlingId}
                        personopplysninger={personopplysninger}
                        brevmottakere={brevmottakere}
                        opprettBrevmottaker={opprettBrevmottaker}
                        slettBrevmottaker={slettBrevmottakere}
                        erLesevisning={false}
                    />
                </>
            )}
        </DataViewer>
    );
}
