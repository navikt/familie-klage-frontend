import { Alert, Button, Heading, HGrid, HStack, VStack } from '@navikt/ds-react';
import { ArrowUndoIcon, TrashIcon } from '@navikt/aksel-icons';
import React, { ReactNode } from 'react';
import { MottakerRolle, mottakerRolleVisningsnavn } from '../Brevmottakere/mottakerRolle';
import {
    erNyBrevmottakerOrganisasjon,
    erNyBrevmottakerPersonMedIdent,
    erNyBrevmottakerPersonUtenIdent,
    NyBrevmottaker,
} from '../Brevmottakere/nyBrevmottaker';
import CountryData from '@navikt/land-verktoy';
import { useBrevmottakereContext } from './context/BrevmottakereContextProvider';
import { Divider } from '../../../Felles/Divider/Divider';
import { formaterOrgNummer } from '../../../App/typer/institusjon';

const countryInstance = CountryData.getCountryInstance('nb');

function utledSlettKnappIkon(mottakerRolle?: MottakerRolle): ReactNode {
    if (
        mottakerRolle === MottakerRolle.DØDSBO ||
        mottakerRolle === MottakerRolle.BRUKER_MED_UTENLANDSK_ADRESSE
    ) {
        return <ArrowUndoIcon />;
    }
    return <TrashIcon />;
}

function utledSlettKnappTittel(mottakerRolle?: MottakerRolle): string {
    if (
        mottakerRolle === MottakerRolle.DØDSBO ||
        mottakerRolle === MottakerRolle.BRUKER_MED_UTENLANDSK_ADRESSE
    ) {
        return 'Tilbakestill til bruker';
    }
    return 'Fjern';
}

interface Props {
    brevmottaker: NyBrevmottaker;
}

export function BrevmottakerDetaljer({ brevmottaker }: Props) {
    const { slettBrevmottaker } = useBrevmottakereContext();

    return (
        <VStack gap={'2'}>
            <Divider />
            <HStack justify={'space-between'}>
                <Heading level={'3'} size={'xsmall'}>
                    {brevmottaker.mottakerRolle
                        ? mottakerRolleVisningsnavn[brevmottaker.mottakerRolle]
                        : 'Ukjent mottakerrolle'}
                </Heading>
                {brevmottaker.mottakerRolle !== MottakerRolle.BRUKER && (
                    <Button
                        variant={'tertiary'}
                        onClick={() => slettBrevmottaker(brevmottaker)}
                        size={'small'}
                        icon={utledSlettKnappIkon(brevmottaker.mottakerRolle)}
                    >
                        {utledSlettKnappTittel(brevmottaker.mottakerRolle)}
                    </Button>
                )}
            </HStack>
            {erNyBrevmottakerPersonUtenIdent(brevmottaker) && (
                <>
                    <HGrid gap={'2'} columns={'1fr 1fr'}>
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
                    {brevmottaker.mottakerRolle === MottakerRolle.BRUKER_MED_UTENLANDSK_ADRESSE && (
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
            {erNyBrevmottakerPersonMedIdent(brevmottaker) && (
                <HGrid gap={'2'} columns={'1fr 1fr'}>
                    <div>Navn:</div>
                    <div>{brevmottaker.navn}</div>
                </HGrid>
            )}
            {erNyBrevmottakerOrganisasjon(brevmottaker) && (
                <HGrid gap={'2'} columns={'1fr 1fr'}>
                    <div>Navn:</div>
                    <div>{brevmottaker.organisasjonsnavn}</div>
                    <div>Organisasjonsnummer:</div>
                    <div>{formaterOrgNummer(brevmottaker.organisasjonsnummer)}</div>
                </HGrid>
            )}
        </VStack>
    );
}
