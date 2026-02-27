import React, { useState } from 'react';

import { TrashIcon } from '@navikt/aksel-icons';
import { Alert, Button, Heading, HGrid, HStack, VStack } from '@navikt/ds-react';
import CountryData from '@navikt/land-verktoy';
import { EøsLandkode } from '../../../../../Felles/Landvelger/landkode';
import { MottakerRolle, mottakerRolleVisningsnavn } from '../../mottakerRolle';
import {
    Brevmottaker,
    erBrevmottakerOrganisasjon,
    erBrevmottakerPersonMedIdent,
    erBrevmottakerPersonUtenIdent,
} from '../../brevmottaker';
import { lagSlettbarBrevmottaker, SlettbarBrevmottaker } from '../../slettbarBrevmottaker';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { formaterOrgNummer } from '../../../../../App/typer/institusjon';

type Props = {
    brevmottaker: Brevmottaker;
    slettBrevmottaker: (slettbarBrevmottaker: SlettbarBrevmottaker) => Promise<Awaited<void>>;
};

const countryInstance = CountryData.getCountryInstance('nb');

export function BrevmottakerDetaljer({ brevmottaker, slettBrevmottaker }: Props) {
    const { behandlingErRedigerbar } = useBehandling();

    const [slettFeilmelding, settSlettFeilmelding] = useState<string>('');
    const [laster, setLaster] = useState<boolean>(false);

    async function onSlettBrevmottakerClicked(): Promise<Awaited<void>> {
        settSlettFeilmelding('');
        setLaster(true);
        const slettbarBrevmottaker = lagSlettbarBrevmottaker(brevmottaker);
        return slettBrevmottaker(slettbarBrevmottaker)
            .then(() => setLaster(false))
            .catch((error: Error) => {
                settSlettFeilmelding(error.message);
                setLaster(false);
            });
    }

    return (
        <VStack marginBlock={'2 2'} gap={'2'}>
            {slettFeilmelding && (
                <Alert
                    variant={'error'}
                    closeButton={true}
                    onClose={() => settSlettFeilmelding('')}
                >
                    {slettFeilmelding}
                </Alert>
            )}
            <HStack justify={'space-between'}>
                <Heading level={'2'} size={'small'}>
                    {brevmottaker.mottakerRolle
                        ? mottakerRolleVisningsnavn[brevmottaker.mottakerRolle]
                        : 'Ukjent mottakerrolle'}
                </Heading>
                {behandlingErRedigerbar && (
                    <Button
                        variant={'tertiary'}
                        onClick={() => onSlettBrevmottakerClicked()}
                        size={'small'}
                        icon={<TrashIcon />}
                        loading={laster}
                    >
                        Fjern
                    </Button>
                )}
            </HStack>
            {erBrevmottakerPersonUtenIdent(brevmottaker) && (
                <>
                    <HGrid gap={'2'} columns={'1fr 2fr'}>
                        <div>Navn:</div>
                        <div>{brevmottaker.navn}</div>
                        <div>Land:</div>
                        <div>{countryInstance.findByValue(brevmottaker.landkode).label}</div>
                        <div>Adresselinje 1:</div>
                        <div>{brevmottaker.adresselinje1}</div>
                        <div>Adresselinje 2:</div>
                        <div>{brevmottaker.adresselinje2 || '-'}</div>
                        {brevmottaker.postnummer && (
                            <>
                                <div>Postnummer</div>
                                <div>{brevmottaker.postnummer || '-'}</div>
                            </>
                        )}
                        {brevmottaker.poststed && (
                            <>
                                <div>Poststed</div>
                                <div>{brevmottaker.poststed || '-'}</div>
                            </>
                        )}
                    </HGrid>
                    {brevmottaker.landkode !== EøsLandkode.NO && (
                        <Alert variant={'info'} inline={true}>
                            Ved utenlandsk adresse skal postnummer og poststed legges i
                            adresselinjene.
                        </Alert>
                    )}
                    {brevmottaker.mottakerRolle === MottakerRolle.DØDSBO && (
                        <Alert variant={'info'} inline={true}>
                            Ved dødsbo kan kun en brevmottaker legges til.
                        </Alert>
                    )}
                </>
            )}
            {erBrevmottakerPersonMedIdent(brevmottaker) && (
                <HGrid gap={'2'} columns={'1fr 1fr'}>
                    <div>Navn:</div>
                    <div>{brevmottaker.navn}</div>
                </HGrid>
            )}
            {erBrevmottakerOrganisasjon(brevmottaker) && (
                <HGrid gap={'2'} columns={'1fr 1fr'}>
                    <div>Organisasjonsnavn:</div>
                    <div>{brevmottaker.organisasjonsnavn}</div>
                    <div>Organisasjonsnummer:</div>
                    <div>{formaterOrgNummer(brevmottaker.organisasjonsnummer)}</div>
                    {brevmottaker.navnHosOrganisasjon && (
                        <>
                            <div>Kontaktperson hos organisasjon:</div>
                            <div>{brevmottaker.navnHosOrganisasjon}</div>
                        </>
                    )}
                </HGrid>
            )}
        </VStack>
    );
}
