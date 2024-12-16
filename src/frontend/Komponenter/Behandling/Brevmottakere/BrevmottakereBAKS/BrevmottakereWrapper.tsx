import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '../../../../App/context/AppContext';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../../App/typer/ressurs';
import { BrevmottakerModalBAKS } from './modal/BrevmottakerModalBAKS';
import { BrevmottakereOppsumering } from './oppsumering/BrevmottakerOppsumering';

export enum Mottakertype {
    BRUKER = 'BRUKER',
    BRUKER_MED_UTENLANDSK_ADRESSE = 'BRUKER_MED_UTENLANDSK_ADRESSE',
    FULLMEKTIG = 'FULLMEKTIG',
    VERGE = 'VERGE',
    DØDSBO = 'DØDSBO',
}

export const mottakerVisningsnavn: Record<Mottakertype, string> = {
    BRUKER: 'Bruker',
    BRUKER_MED_UTENLANDSK_ADRESSE: 'Bruker med utenlandsk adresse',
    FULLMEKTIG: 'Fullmektig',
    VERGE: 'Verge',
    DØDSBO: 'Dødsbo',
};

export interface Brevmottaker {
    id: string;
    mottakertype: Mottakertype;
    navn: string;
    land: string;
    adresselinje1: string;
    adresselinje2?: string | null;
    postnummer?: string | null;
    poststed?: string | null;
}

const BrevmottakereWrapper: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();
    const { personopplysningerResponse: personopplysninger } = useBehandling();
    const [mottakere, settMottakere] = useState<Ressurs<Brevmottaker[]>>(byggTomRessurs());

    const hentBrevmottakere = useCallback(() => {
        // axiosRequest<Brevmottaker[], null>({
        //     method: 'GET',
        //     url: `/familie-klage/api/brev/${behandlingId}/mottakere`,
        // }).then((res: Ressurs<Brevmottaker[]>) => settMottakere(res));

        settMottakere({
            status: RessursStatus.SUKSESS,
            data: [
                {
                    id: '1c1c2fce-2949-48e8-92ad-61edcec8f7a1',
                    mottakertype: Mottakertype.VERGE,
                    navn: 'Kari Nordmann',
                    adresselinje1: 'Danskeveien 123, 1337, København',
                    land: 'DK',
                },
                /*
                {
                    id: '2c1c2fce-2949-48e8-92ad-61edcec8f7a1',
                    mottakertype: Mottakertype.VERGE,
                    navn: 'Ola Nordmann',
                    adresselinje1: 'Danskeveien 123, 1337, København',
                    land: 'NO',
                },
                 */
            ],
        });
        // }, [axiosRequest, behandlingId]);
    }, []);

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
                        slettBrevmottaker={slettBrevmottakere}
                        erLesevisning={false}
                    />
                </>
            )}
        </DataViewer>
    );
};

export default BrevmottakereWrapper;
