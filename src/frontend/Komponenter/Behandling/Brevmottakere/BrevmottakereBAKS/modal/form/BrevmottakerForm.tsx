import React from 'react';
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
import { lagOpprettBrevmottakerDto, OpprettBrevmottakerDto } from '../../opprettBrevmottakerDto';

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
    lukkModal: () => void;
    opprettBrevmottaker: (opprettBrevmottakerDto: OpprettBrevmottakerDto) => void;
};

// TODO : Burde "Avbryt" knappen lukke hele modalen eller kun formen?
export function BrevmottakerForm({
    personopplysninger,
    brevmottakere,
    erLesevisning,
    lukkModal,
    opprettBrevmottaker,
}: Props) {
    const form = useForm<BrevmottakerFormValues>({ mode: 'all', defaultValues });
    const { handleSubmit, watch } = form;

    const landkode = watch(BrevmottakerFeltnavn.LANDKODE);
    const erLandValgt = landkode !== '';
    const erUtenlandskAdresseValgt = erLandValgt && landkode !== EøsLandkode.NO;

    function onSubmit(brevmottakerFormValues: BrevmottakerFormValues) {
        const opprettBrevmottakerDto = lagOpprettBrevmottakerDto(brevmottakerFormValues);
        opprettBrevmottaker(opprettBrevmottakerDto);
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack gap={'4'}>
                    <Heading level={'2'} size={'medium'}>
                        Ny mottaker
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
                    <HStack gap={'4'}>
                        {!erLesevisning && (
                            <Button variant={'primary'} type={'submit'}>
                                Legg til mottaker
                            </Button>
                        )}
                        <Button variant={'tertiary'} onClick={lukkModal}>
                            Avbryt
                        </Button>
                    </HStack>
                </VStack>
            </form>
        </FormProvider>
    );
}
