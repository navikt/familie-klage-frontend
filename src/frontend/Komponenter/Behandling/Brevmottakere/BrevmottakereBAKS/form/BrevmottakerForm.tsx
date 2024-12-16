import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { LandvelgerFelt } from './felter/LandvelgerFelt';
import { MottakerFelt } from './felter/MottakerFelt';
import { Mottaker } from '../BrevmottakereBAKS';
import { Submit } from './felter/Submit';
import { FormDebugger } from './felter/FormDebugger';
import { NavnFelt } from './felter/NavnFelt';
import { AdresselinjeFelt } from './felter/AdresselinjeFelt';
import { PostnummerFelt } from './felter/PostnummerFelt';
import { PoststedFelt } from './felter/PoststedFelt';
import { Alert, VStack } from '@navikt/ds-react';
import { EøsLandkode } from '../../../../../Felles/Landvelger/landkode';
import { BrevmottakerFeltnavn } from './brevmottakerFeltnavn';
import { BrevmottakerFormState } from './brevmottakerFormState';

type Props = {
    erLesevisning: boolean; // TODO : Flytt til context?
};

export function BrevmottakerForm({ erLesevisning }: Props) {
    const onSubmit: SubmitHandler<BrevmottakerFormState> = (data) => {
        // TODO : Renvask innsendt data
        // TODO : Send renvasket data til backend
        console.log(data);
    };

    const form = useForm<BrevmottakerFormState>({
        mode: 'all',
        defaultValues: {
            [BrevmottakerFeltnavn.MOTTAKER]: Mottaker.BRUKER,
            [BrevmottakerFeltnavn.LANDKODE]: EøsLandkode.NO,
            [BrevmottakerFeltnavn.NAVN]: '',
            [BrevmottakerFeltnavn.ADRESSELINJE1]: '',
            [BrevmottakerFeltnavn.ADRESSELINJE2]: '',
            [BrevmottakerFeltnavn.POSTNUMMER]: '',
            [BrevmottakerFeltnavn.POSTSTED]: '',
        },
    });

    const { handleSubmit, getValues } = form;

    const landkode = getValues()[BrevmottakerFeltnavn.LANDKODE];
    const erLandValgt = landkode !== '';
    const erUtenlandskAdresseValgt = erLandValgt && landkode !== EøsLandkode.NO;

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack gap={'4'}>
                    <MottakerFelt
                        feltnavn={BrevmottakerFeltnavn.MOTTAKER}
                        visningsnavn={'Mottaker'}
                        erLesevisning={erLesevisning}
                    />
                    <LandvelgerFelt
                        feltnavn={BrevmottakerFeltnavn.LANDKODE}
                        visningsnavn={'Landvelger'}
                        erLesevisning={erLesevisning}
                    />
                    {erLandValgt && (
                        <>
                            <NavnFelt
                                feltnavn={BrevmottakerFeltnavn.NAVN}
                                visningsnavn={'Navn'}
                                erLesevisning={erLesevisning}
                            />
                            <AdresselinjeFelt
                                feltnavn={BrevmottakerFeltnavn.ADRESSELINJE1}
                                visningsnavn={'Adresselinje 1'}
                                erLesevisning={erLesevisning}
                                valgfri={false}
                                beskrivelse={
                                    erUtenlandskAdresseValgt && (
                                        <Alert size={'small'} inline={true} variant={'info'}>
                                            Ved utenlandsk adresse skal postnummer og poststed
                                            skrives direkte i adressefeltet.
                                        </Alert>
                                    )
                                }
                            />
                            <AdresselinjeFelt
                                feltnavn={BrevmottakerFeltnavn.ADRESSELINJE2}
                                visningsnavn={'Adresselinje 2 (valgfri)'}
                                erLesevisning={erLesevisning}
                                valgfri={true}
                            />
                            {!erUtenlandskAdresseValgt && (
                                <>
                                    <PostnummerFelt
                                        feltnavn={BrevmottakerFeltnavn.POSTNUMMER}
                                        visningsnavn={'Postnummer'}
                                        erLesevisning={erLesevisning}
                                    />
                                    <PoststedFelt
                                        feltnavn={BrevmottakerFeltnavn.POSTSTED}
                                        visningsnavn={'Poststed'}
                                        erLesevisning={erLesevisning}
                                    />
                                </>
                            )}
                        </>
                    )}
                    <Submit erLesevisning={erLesevisning} />
                    <FormDebugger />
                </VStack>
            </form>
        </FormProvider>
    );
}
