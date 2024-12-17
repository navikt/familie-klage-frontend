import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '../../../../App/context/AppContext';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { byggTomRessurs, Ressurs } from '../../../../App/typer/ressurs';
import { BrevmottakerModalBAKS } from './modal/BrevmottakerModalBAKS';
import { BrevmottakereOppsumering } from './oppsumering/BrevmottakerOppsumering';

export enum Mottakertype {
    BRUKER_MED_UTENLANDSK_ADRESSE = 'BRUKER_MED_UTENLANDSK_ADRESSE',
    FULLMEKTIG = 'FULLMEKTIG',
    VERGE = 'VERGE',
    DØDSBO = 'DØDSBO',
}

export const mottakerVisningsnavn: Record<Mottakertype, string> = {
    BRUKER_MED_UTENLANDSK_ADRESSE: 'Bruker med utenlandsk adresse',
    FULLMEKTIG: 'Fullmektig',
    VERGE: 'Verge',
    DØDSBO: 'Dødsbo',
};

export type Brevmottaker = {
    id: string;
    mottakertype: Mottakertype;
    navn: string;
    landkode: string;
    adresselinje1: string;
    adresselinje2?: string | null;
    postnummer?: string | null;
    poststed?: string | null;
};

export type OpprettBrevmottakerDto = Omit<Brevmottaker, 'id'>;

const BrevmottakereWrapper: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
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
};

export default BrevmottakereWrapper;
