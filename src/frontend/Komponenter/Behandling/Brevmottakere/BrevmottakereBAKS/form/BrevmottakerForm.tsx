import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { LandvelgerFelt } from './felt/LandvelgerFelt';
import { MottakerFelt } from './felt/MottakerFelt';
import { BrevmottakerMedAdresse, Mottaker } from '../BrevmottakereBAKS';
import { Submit } from './felt/Submit';
import { FormDebugger } from './FormDebugger';
import { NavnFelt } from './felt/NavnFelt';
import { AdresselinjeFelt } from './felt/AdresselinjeFelt';
import { PostnummerFelt } from './felt/PostnummerFelt';
import { PoststedFelt } from './felt/PoststedFelt';
import { Alert, VStack } from '@navikt/ds-react';
import { EøsLandkode } from '../../../../../Felles/Landvelger/landkode';
import { BrevmottakerFeltnavn } from './brevmottakerFeltnavn';
import { BrevmottakerFormState } from './brevmottakerFormState';
import { useApp } from '../../../../../App/context/AppContext';

type Props = {
    behandlingId: string;
    erLesevisning: boolean; // TODO : Flytt til context?
};

export function BrevmottakerForm({ behandlingId, erLesevisning }: Props) {
    const { axiosRequest } = useApp();

    const kallSettBrevmottakere = (brevmottaker: BrevmottakerMedAdresse) =>
        axiosRequest<BrevmottakerMedAdresse, BrevmottakerMedAdresse>({
            url: `familie-klage/api/brevmottaker-med-adresse/${behandlingId}/mottakere`,
            method: 'POST',
            data: brevmottaker,
        });

    const onSubmit: SubmitHandler<BrevmottakerFormState> = (data) => {
        const { mottaker, navn, landkode, adresselinje1, adresselinje2, postnummer, poststed } =
            data;
        const erUtenlandskLandkode = landkode !== EøsLandkode.NO;
        kallSettBrevmottakere({
            mottakerRolle: mottaker,
            navn: navn,
            land: landkode,
            adresselinje1: adresselinje1,
            adresselinje2: adresselinje2,
            postnummer: erUtenlandskLandkode ? null : postnummer,
            poststed: erUtenlandskLandkode ? null : poststed,
        });
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
