import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '../../../../App/context/AppContext';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { byggTomRessurs, Ressurs } from '../../../../App/typer/ressurs';
import { BrevmottakerModalBAKS } from './modal/BrevmottakerModalBAKS';
import { BrevmottakereOppsumering } from './oppsumering/BrevmottakerOppsumering';
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

    const opprettBrevmottaker = (brevmottaker: OpprettBrevmottakerDto) =>
        axiosRequest<Brevmottaker[], OpprettBrevmottakerDto>({
            url: `familie-klage/api/brevmottaker/${behandlingId}`,
            method: 'POST',
            data: brevmottaker,
        }).then((res: Ressurs<Brevmottaker[]>) => settMottakere(res));

    const slettBrevmottakere = (brevmottakerId: string) => {
        axiosRequest<Brevmottaker[], null>({
            method: 'DELETE',
            url: `/familie-klage/api/brevmottaker/${behandlingId}/${brevmottakerId}`,
        }).then((res: Ressurs<Brevmottaker[]>) => settMottakere(res));
    };

    useEffect(() => {
        hentBrevmottakere();
    }, [hentBrevmottakere]);

    return (
        <DataViewer response={{ mottakere, personopplysninger }}>
            {({ mottakere, personopplysninger }) => (
                <>
                    <BrevmottakereOppsumering brevmottakere={mottakere} />
                    <BrevmottakerModalBAKS
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
