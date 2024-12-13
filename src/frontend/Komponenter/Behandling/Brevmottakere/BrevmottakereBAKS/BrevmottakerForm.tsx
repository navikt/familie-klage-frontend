import React from 'react';
import { FormProvider, SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { LandvelgerFelt } from './felter/LandvelgerFelt';
import { MottakerFelt } from './felter/MottakerFelt';
import { Mottaker } from './BrevmottakereBAKS';
import { Submit } from './felter/Submit';
import { FormDebugger } from './felter/FormDebugger';
import { NavnFelt } from './felter/NavnFelt';
import { AdresselinjeFelt } from './felter/AdresselinjeFelt';
import { PostnummerFelt } from './felter/PostnummerFelt';
import { PoststedFelt } from './felter/PoststedFelt';
import { Alert, VStack } from '@navikt/ds-react';
import { Landkoder } from '../../../../Felles/Landvelger/Landvelger';

export enum BrevmottakerFeltnavn {
    MOTTAKER = 'mottaker',
    LAND = 'land',
    NAVN = 'navn',
    ADRESSELINJE1 = 'adresselinje1',
    ADRESSELINJE2 = 'adresselinje2',
    POSTNUMMER = 'postnummer',
    POSTSTED = 'poststed',
}

export type BrevmottakerFormState = {
    [BrevmottakerFeltnavn.MOTTAKER]: Mottaker;
    [BrevmottakerFeltnavn.LAND]: string;
    [BrevmottakerFeltnavn.NAVN]: string;
    [BrevmottakerFeltnavn.ADRESSELINJE1]: string;
    [BrevmottakerFeltnavn.ADRESSELINJE2]: string;
    [BrevmottakerFeltnavn.POSTNUMMER]: string;
    [BrevmottakerFeltnavn.POSTSTED]: string;
};

type Props = {
    erLesevisning: boolean;
};

const BrevmottakerForm = ({ erLesevisning }: Props) => {
    const onSubmit: SubmitHandler<BrevmottakerFormState> = (data) => {
        // TODO : Renvask innsendt data
        console.log(data);
    };

    const onSubmitError: SubmitErrorHandler<BrevmottakerFormState> = (errors) => {
        console.log(errors);
    };

    const form = useForm<BrevmottakerFormState>({
        mode: 'all',
        defaultValues: {
            [BrevmottakerFeltnavn.MOTTAKER]: Mottaker.BRUKER,
            [BrevmottakerFeltnavn.LAND]: Landkoder.NO,
            [BrevmottakerFeltnavn.NAVN]: '',
            [BrevmottakerFeltnavn.ADRESSELINJE1]: '',
            [BrevmottakerFeltnavn.ADRESSELINJE2]: '',
            [BrevmottakerFeltnavn.POSTNUMMER]: '',
            [BrevmottakerFeltnavn.POSTSTED]: '',
        },
    });

    const { handleSubmit, getValues } = form;

    const land = getValues()[BrevmottakerFeltnavn.LAND];
    const erLandValgt = land !== '';
    const erUtenlandskAdresseValgt = land !== Landkoder.NO && erLandValgt;

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
                <VStack gap={'4'}>
                    <MottakerFelt
                        name={BrevmottakerFeltnavn.MOTTAKER}
                        label={'Mottaker'}
                        erLesevisning={erLesevisning}
                    />
                    <LandvelgerFelt
                        name={BrevmottakerFeltnavn.LAND}
                        label={'Landvelger'}
                        erLesevisning={erLesevisning}
                    />
                    {erLandValgt && (
                        <>
                            <NavnFelt
                                name={BrevmottakerFeltnavn.NAVN}
                                label={'Navn'}
                                erLesevisning={erLesevisning}
                            />
                            <AdresselinjeFelt
                                name={BrevmottakerFeltnavn.ADRESSELINJE1}
                                label={'Adresselinje 1'}
                                erLesevisning={erLesevisning}
                                required={true}
                                description={
                                    erUtenlandskAdresseValgt && (
                                        <Alert size={'small'} inline={true} variant={'info'}>
                                            Ved utenlandsk adresse skal postnummer og poststed
                                            skrives direkte i adressefeltet.
                                        </Alert>
                                    )
                                }
                            />
                            <AdresselinjeFelt
                                name={BrevmottakerFeltnavn.ADRESSELINJE2}
                                label={'Adresselinje 2 (valgfri)'}
                                erLesevisning={erLesevisning}
                                required={false}
                            />
                            {!erUtenlandskAdresseValgt && (
                                <>
                                    <PostnummerFelt
                                        name={BrevmottakerFeltnavn.POSTNUMMER}
                                        label={'Postnummer'}
                                        erLesevisning={erLesevisning}
                                    />
                                    <PoststedFelt
                                        name={BrevmottakerFeltnavn.POSTSTED}
                                        label={'Poststed'}
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
};

export default BrevmottakerForm;
