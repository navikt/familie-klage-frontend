import React, { useState } from 'react';
import { DefaultValues, FormProvider, useForm } from 'react-hook-form';
import { LandFelt } from './felt/LandFelt';
import { MottakerFelt } from './felt/MottakerFelt';
import { NavnFelt } from './felt/NavnFelt';
import { AdresselinjeFelt } from './felt/AdresselinjeFelt';
import { PostnummerFelt } from './felt/PostnummerFelt';
import { PoststedFelt } from './felt/PoststedFelt';
import { Alert, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { EøsLandkode } from '../../../../../../Felles/Landvelger/landkode';
import { IPersonopplysninger } from '../../../../../../App/typer/personopplysninger';
import { BrevmottakerFeltnavn } from './felt/felttyper';
import { Brevmottaker } from '../../brevmottaker';
import { Mottakertype } from '../../mottakertype';
import { lagNyBrevmottaker, NyBrevmottaker } from '../../nyBrevmottaker';

export type BrevmottakerFormValues = {
    [BrevmottakerFeltnavn.MOTTAKERTYPE]: Mottakertype | '';
    [BrevmottakerFeltnavn.LANDKODE]: EøsLandkode | '';
    [BrevmottakerFeltnavn.NAVN]: string;
    [BrevmottakerFeltnavn.ADRESSELINJE1]: string;
    [BrevmottakerFeltnavn.ADRESSELINJE2]: string;
    [BrevmottakerFeltnavn.POSTNUMMER]: string;
    [BrevmottakerFeltnavn.POSTSTED]: string;
};

const defaultValues: DefaultValues<BrevmottakerFormValues> = {
    [BrevmottakerFeltnavn.MOTTAKERTYPE]: '',
    [BrevmottakerFeltnavn.LANDKODE]: EøsLandkode.NO,
    [BrevmottakerFeltnavn.NAVN]: '',
    [BrevmottakerFeltnavn.ADRESSELINJE1]: '',
    [BrevmottakerFeltnavn.ADRESSELINJE2]: '',
    [BrevmottakerFeltnavn.POSTNUMMER]: '',
    [BrevmottakerFeltnavn.POSTSTED]: '',
};

type Props = {
    behandlingId: string;
    personopplysninger: IPersonopplysninger;
    brevmottakere: Brevmottaker[];
    erLesevisning: boolean;
    lukkForm: () => void;
    opprettBrevmottaker: (nyBrevmottaker: NyBrevmottaker) => Promise<boolean>;
};

export function BrevmottakerForm({
    personopplysninger,
    brevmottakere,
    erLesevisning,
    lukkForm,
    opprettBrevmottaker,
}: Props) {
    const [visSubmitError, setVisSubmitError] = useState<boolean>(false);
    const form = useForm<BrevmottakerFormValues>({ mode: 'onChange', defaultValues });
    const { formState, handleSubmit, watch } = form;

    const landkode = watch(BrevmottakerFeltnavn.LANDKODE);
    const erLandValgt = landkode !== '';
    const erUtenlandskAdresseValgt = erLandValgt && landkode !== EøsLandkode.NO;

    async function onSubmit(brevmottakerFormValues: BrevmottakerFormValues) {
        setVisSubmitError(false);
        const nyBrevmottaker = lagNyBrevmottaker(brevmottakerFormValues);
        const erSuksess = await opprettBrevmottaker(nyBrevmottaker);
        if (erSuksess) {
            lukkForm();
        } else {
            setVisSubmitError(true);
        }
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack gap={'4'}>
                    <Heading level={'2'} size={'medium'}>
                        Ny brevmottaker
                    </Heading>
                    <MottakerFelt
                        feltnavn={BrevmottakerFeltnavn.MOTTAKERTYPE}
                        visningsnavn={'Mottaker'}
                        personopplysninger={personopplysninger}
                        brevmottakere={brevmottakere}
                        erLesevisning={erLesevisning}
                    />
                    <LandFelt
                        feltnavn={BrevmottakerFeltnavn.LANDKODE}
                        visningsnavn={'Land'}
                        personopplysninger={personopplysninger}
                        erLesevisning={erLesevisning}
                    />
                    {erLandValgt && (
                        <>
                            <NavnFelt
                                feltnavn={BrevmottakerFeltnavn.NAVN}
                                visningsnavn={'Navn'}
                                personopplysninger={personopplysninger}
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
                    {visSubmitError && (
                        <Alert
                            variant={'error'}
                            closeButton={true}
                            onClose={() => setVisSubmitError(false)}
                        >
                            Noe gikk galt ved lagring av brevmottaker.
                        </Alert>
                    )}
                    <HStack gap={'4'}>
                        {!erLesevisning && (
                            <Button
                                variant={'primary'}
                                type={'submit'}
                                loading={formState.isSubmitting}
                            >
                                Legg til brevmottaker
                            </Button>
                        )}
                        {!erLesevisning && brevmottakere.length > 0 && !formState.isSubmitting && (
                            <Button variant={'tertiary'} onClick={lukkForm}>
                                Avbryt legg til mottaker
                            </Button>
                        )}
                    </HStack>
                </VStack>
            </form>
        </FormProvider>
    );
}
