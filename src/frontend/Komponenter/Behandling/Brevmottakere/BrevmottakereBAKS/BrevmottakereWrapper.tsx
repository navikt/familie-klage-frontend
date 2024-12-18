import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '../../../../App/context/AppContext';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { byggTomRessurs, Ressurs } from '../../../../App/typer/ressurs';
import { BrevmottakerModal } from './modal/BrevmottakerModal';
import { BrevmottakerPanel } from './panel/BrevmottakerPanel';
import { Brevmottaker, OpprettBrevmottakerDto } from './brevmottaker';

type Props = {
    behandlingId: string;
};

export function BrevmottakereWrapper({ behandlingId }: Props) {
    const { axiosRequest } = useApp();
    const { personopplysningerResponse: personopplysninger } = useBehandling();
    const [mottakere, settMottakere] = useState<Ressurs<Brevmottaker[]>>(byggTomRessurs());

    const hentBrevmottakere = useCallback(() => {
        axiosRequest<Brevmottaker[], null>({
            method: 'GET',
            url: `/familie-klage/api/brevmottaker/${behandlingId}`,
        }).then((res: Ressurs<Brevmottaker[]>) => settMottakere(res));
    }, [axiosRequest, behandlingId]);

    function opprettBrevmottaker(opprettBrevmottakerDto: OpprettBrevmottakerDto) {
        axiosRequest<Brevmottaker[], OpprettBrevmottakerDto>({
            url: `familie-klage/api/brevmottaker/${behandlingId}`,
            method: 'POST',
            data: opprettBrevmottakerDto,
        }).then((res: Ressurs<Brevmottaker[]>) => settMottakere(res));
    }

    function slettBrevmottakere(brevmottakerId: string) {
        axiosRequest<Brevmottaker[], null>({
            method: 'DELETE',
            url: `/familie-klage/api/brevmottaker/${behandlingId}/${brevmottakerId}`,
        }).then((res: Ressurs<Brevmottaker[]>) => settMottakere(res));
    }

    useEffect(() => {
        hentBrevmottakere();
    }, [hentBrevmottakere]);

    return (
        <DataViewer response={{ mottakere, personopplysninger }}>
            {({ mottakere, personopplysninger }) => (
                <>
                    <BrevmottakerPanel brevmottakere={mottakere} />
                    <BrevmottakerModal
                        behandlingId={behandlingId}
                        personopplysninger={personopplysninger}
                        brevmottakere={mottakere}
                        opprettBrevmottaker={opprettBrevmottaker}
                        slettBrevmottaker={slettBrevmottakere}
                        erLesevisning={false}
                    />
                </>
            )}
        </DataViewer>
    );
}
