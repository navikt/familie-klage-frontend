import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { LandFelt } from './felt/LandFelt';
import { MottakerFelt } from './felt/MottakerFelt';
import { NavnFelt } from './felt/NavnFelt';
import { Adresselinje1Felt } from './felt/Adresselinje1Felt';
import { PostnummerFelt } from './felt/PostnummerFelt';
import { PoststedFelt } from './felt/PoststedFelt';
import { Alert, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import {
    BlankEøsLandkode,
    erEøsLandkode,
    erUtenlandskEøsLandkode,
    EøsLandkode,
} from '../../../../../../Felles/Landvelger/landkode';
import { IPersonopplysninger } from '../../../../../../App/typer/personopplysninger';
import { BlankMottakerRolle, MottakerRolle } from '../../../mottakerRolle';
import { BrevmottakerPersonUtenIdent } from '../../../brevmottaker';
import { lagNyBrevmottakerPersonUtenIdent, NyBrevmottaker } from '../../../nyBrevmottaker';
import { Adresselinje2Felt } from './felt/Adresselinje2Felt';

export enum BrevmottakerFeltnavn {
    MOTTAKERROLLE = 'mottakerRolle',
    LANDKODE = 'landkode',
    NAVN = 'navn',
    ADRESSELINJE1 = 'adresselinje1',
    ADRESSELINJE2 = 'adresselinje2',
    POSTNUMMER = 'postnummer',
    POSTSTED = 'poststed',
}

export interface BrevmottakerFormValues {
    [BrevmottakerFeltnavn.MOTTAKERROLLE]: MottakerRolle | BlankMottakerRolle;
    [BrevmottakerFeltnavn.LANDKODE]: EøsLandkode | BlankEøsLandkode;
    [BrevmottakerFeltnavn.NAVN]: string;
    [BrevmottakerFeltnavn.ADRESSELINJE1]: string;
    [BrevmottakerFeltnavn.ADRESSELINJE2]: string;
    [BrevmottakerFeltnavn.POSTNUMMER]: string;
    [BrevmottakerFeltnavn.POSTSTED]: string;
}

interface Props {
    behandlingId: string;
    personopplysninger: IPersonopplysninger;
    brevmottakere: BrevmottakerPersonUtenIdent[];
    erLesevisning: boolean;
    lukkForm: () => void;
    opprettBrevmottaker: (nyBrevmottaker: NyBrevmottaker) => Promise<boolean>;
}

export function BrevmottakerForm({
    personopplysninger,
    brevmottakere,
    erLesevisning,
    lukkForm,
    opprettBrevmottaker,
}: Props) {
    const [visSubmitError, setVisSubmitError] = useState<boolean>(false);

    const form = useForm<BrevmottakerFormValues>({
        defaultValues: {
            [BrevmottakerFeltnavn.MOTTAKERROLLE]: '',
            [BrevmottakerFeltnavn.LANDKODE]: EøsLandkode.NO,
            [BrevmottakerFeltnavn.NAVN]: '',
            [BrevmottakerFeltnavn.ADRESSELINJE1]: '',
            [BrevmottakerFeltnavn.ADRESSELINJE2]: '',
            [BrevmottakerFeltnavn.POSTNUMMER]: '',
            [BrevmottakerFeltnavn.POSTSTED]: '',
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
        watch,
    } = form;

    const landkode = watch(BrevmottakerFeltnavn.LANDKODE);

    async function onSubmit(brevmottakerFormValues: BrevmottakerFormValues) {
        setVisSubmitError(false);
        const erSuksess = await opprettBrevmottaker(
            lagNyBrevmottakerPersonUtenIdent(brevmottakerFormValues)
        );
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
                        personopplysninger={personopplysninger}
                        brevmottakere={brevmottakere}
                        erLesevisning={erLesevisning}
                    />
                    <LandFelt
                        personopplysninger={personopplysninger}
                        erLesevisning={erLesevisning}
                    />
                    {erEøsLandkode(landkode) && (
                        <>
                            <NavnFelt erLesevisning={erLesevisning} />
                            <Adresselinje1Felt erLesevisning={erLesevisning} />
                            <Adresselinje2Felt erLesevisning={erLesevisning} />
                            {!erUtenlandskEøsLandkode(landkode) && (
                                <>
                                    <PostnummerFelt erLesevisning={erLesevisning} />
                                    <PoststedFelt erLesevisning={erLesevisning} />
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
                            <Button variant={'primary'} type={'submit'} loading={isSubmitting}>
                                Legg til brevmottaker
                            </Button>
                        )}
                        {!erLesevisning && brevmottakere.length > 0 && !isSubmitting && (
                            <Button variant={'tertiary'} onClick={lukkForm}>
                                Avbryt legg til brevmottaker
                            </Button>
                        )}
                    </HStack>
                </VStack>
            </form>
        </FormProvider>
    );
}
