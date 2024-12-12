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
import { VStack } from '@navikt/ds-react';

export type BrevmottakerFormState = {
    mottaker: Mottaker;
    land: string;
    navn: string;
    adresselinje1: string;
    adresselinje2: string;
    postnummer: string;
    poststed: string;
};

type Props = {
    erLesevisning: boolean;
};

const BrevmottakerForm = ({ erLesevisning }: Props) => {
    const onSubmit: SubmitHandler<BrevmottakerFormState> = (data) => {
        console.log(data);
    };

    const onSubmitError: SubmitErrorHandler<BrevmottakerFormState> = (errors) => {
        console.log(errors);
    };

    const form = useForm<BrevmottakerFormState>({
        mode: 'all',
        defaultValues: {
            mottaker: Mottaker.BRUKER,
            land: '',
            navn: '',
            adresselinje1: '',
            adresselinje2: '',
            postnummer: '',
            poststed: '',
        },
        // TODO : Legg til yup for validering?
    });

    const { handleSubmit } = form;

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
                <VStack gap={'4'}>
                    <MottakerFelt
                        name={'mottaker'}
                        label={'Mottaker'}
                        erLesevisning={erLesevisning}
                    />
                    <LandvelgerFelt
                        name={'land'}
                        label={'Landvelger'}
                        erLesevisning={erLesevisning}
                    />
                    <NavnFelt name={'navn'} label={'Navn'} erLesevisning={erLesevisning} />
                    <AdresselinjeFelt
                        name={'adresselinje1'}
                        label={'Adresselinje 1'}
                        erLesevisning={erLesevisning}
                        required={true}
                    />
                    <AdresselinjeFelt
                        name={'adresselinje2'}
                        label={'Adresselinje 2 (valgfri)'}
                        erLesevisning={erLesevisning}
                        required={false}
                    />
                    <PostnummerFelt
                        name={'postnummer'}
                        label={'Postnummer'}
                        erLesevisning={erLesevisning}
                    />
                    <PoststedFelt
                        name={'poststed'}
                        label={'poststed'}
                        erLesevisning={erLesevisning}
                    />
                    <Submit erLesevisning={erLesevisning} />
                    <FormDebugger />
                </VStack>
            </form>
        </FormProvider>
    );
};

export default BrevmottakerForm;
