import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useApp } from '../../../../App/context/AppContext';
import { Alert, BodyShort, Button, Label, Tooltip } from '@navikt/ds-react';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../../App/typer/ressurs';
import CountryData from '@navikt/land-verktoy';
import { BrevmottakerModalBAKS } from './modal/BrevmottakerModalBAKS';

const Grid = styled.div`
    display: grid;
    grid-template-columns: 9rem 23rem 16rem;
`;

const InfoHeader = styled.div`
    display: grid;
    grid-template-columns: 26rem 12rem;
`;

const KompaktButton = styled(Button)`
    padding: 0;
    justify-content: right;
`;

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

const BrevmottakereContainer: React.FC<{
    mottakere: Brevmottaker[];
}> = ({ mottakere }) => {
    const { settVisBrevmottakereModal } = useApp();
    const { behandlingErRedigerbar } = useBehandling();
    const utledNavnPåMottakere = (brevMottakere: Brevmottaker[]) => {
        return [
            ...brevMottakere.map((person) => {
                const land = CountryData.getCountryInstance('nb').findByValue(person.land).label;
                return (
                    `${person.navn} (${mottakerVisningsnavn[person.mottakertype]}): ${person.adresselinje1}, ` +
                    (person.land === 'NO'
                        ? `${person.postnummer}, ${person.poststed}, ${land}`
                        : `${land}`)
                );
            }),
        ];
    };

    const navn = utledNavnPåMottakere(mottakere);
    const flereBrevmottakereErValgt = navn.length > 1;
    const erBrevmottakerAvTypeBruker = mottakere.find(
        (person) => person.mottakertype === Mottakertype.BRUKER
    );

    return flereBrevmottakereErValgt || !erBrevmottakerAvTypeBruker ? (
        <Alert variant={'info'}>
            <InfoHeader>
                <Label>Brevmottakere:</Label>
                {behandlingErRedigerbar && (
                    <Tooltip content={'Legg til verge eller fullmektige brevmottakere'}>
                        <KompaktButton
                            variant={'tertiary'}
                            onClick={() => settVisBrevmottakereModal(true)}
                        >
                            Legg til/endre brevmottakere
                        </KompaktButton>
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
    ) : (
        <Grid>
            <Label>Brevmottaker:</Label>
            <BodyShort>{navn.map((navn) => navn)}</BodyShort>
            {behandlingErRedigerbar && (
                <Tooltip content={'Legg til verge eller fullmektige brevmottakere'}>
                    <KompaktButton
                        variant={'tertiary'}
                        onClick={() => settVisBrevmottakereModal(true)}
                    >
                        Legg til/endre brevmottakere
                    </KompaktButton>
                </Tooltip>
            )}
        </Grid>
    );
};

const BrevmottakereBAKS: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();
    const { personopplysningerResponse } = useBehandling();
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
                    id: '9c1c2fce-2949-48e8-92ad-61edcec8f7a1',
                    mottakertype: Mottakertype.DØDSBO,
                    navn: 'Kari Nordmann',
                    adresselinje1: 'Danskeveien 123, 1337, København',
                    land: 'DK',
                },
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
        <DataViewer response={{ mottakere, personopplysningerResponse }}>
            {({ mottakere, personopplysningerResponse }) => (
                <>
                    <BrevmottakereContainer mottakere={mottakere} />
                    <BrevmottakerModalBAKS
                        behandlingId={behandlingId}
                        personopplysninger={personopplysningerResponse}
                        brevmottakere={mottakere}
                        slettBrevmottaker={slettBrevmottakere}
                        erLesevisning={false}
                    />
                </>
            )}
        </DataViewer>
    );
};

export default BrevmottakereBAKS;
