import React, { useEffect } from 'react';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { LandFelt } from './felt/LandFelt';
import { MottakerFelt } from './felt/MottakerFelt';
import { NavnFelt } from './felt/NavnFelt';
import { Adresselinje1Felt } from './felt/Adresselinje1Felt';
import { PostnummerFelt } from './felt/PostnummerFelt';
import { PoststedFelt } from './felt/PoststedFelt';
import { Alert, Button, Fieldset, HStack, VStack } from '@navikt/ds-react';
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
import { useBehandling } from '../../../../../../App/context/BehandlingContext';

export const CustomFormErrors: Record<
    'onSubmitServerError',
    {
        id: `root.${string}`;
        lookup: (errors: FieldErrors<BrevmottakerFormValues>) => string | undefined;
    }
> = {
    onSubmitServerError: {
        id: 'root.onSubmitServerError',
        lookup: (errors) => errors?.root?.onSubmitServerError?.message,
    },
};

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
    personopplysninger: IPersonopplysninger;
    brevmottakere: BrevmottakerPersonUtenIdent[];
    opprettBrevmottaker: (nyBrevmottaker: NyBrevmottaker) => Promise<Awaited<void>>;
    lukkForm: () => void;
}

export function BrevmottakerForm({
    personopplysninger,
    brevmottakere,
    opprettBrevmottaker,
    lukkForm,
}: Props) {
    const { behandlingErRedigerbar } = useBehandling();

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
        formState: { isSubmitting, isSubmitSuccessful, errors },
        watch,
        setError,
        clearErrors,
        reset,
    } = form;

    useEffect(() => {
        // It's recommended to reset inside useEffect after submission, see https://react-hook-form.com/docs/useform/reset.
        reset();
    }, [reset, isSubmitSuccessful]);

    async function onSubmit(
        brevmottakerFormValues: BrevmottakerFormValues
    ): Promise<Awaited<void>> {
        return opprettBrevmottaker(lagNyBrevmottakerPersonUtenIdent(brevmottakerFormValues))
            .then(() => lukkForm())
            .catch((error: Error) =>
                setError(CustomFormErrors.onSubmitServerError.id, { message: error.message })
            );
    }

    const landkode = watch(BrevmottakerFeltnavn.LANDKODE);
    const onSubmitServerError = CustomFormErrors.onSubmitServerError.lookup(errors);

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack gap={'4'}>
                    <Fieldset legend={'Ny brevmottaker'} hideLegend={true}>
                        <MottakerFelt
                            personopplysninger={personopplysninger}
                            brevmottakere={brevmottakere}
                            erLesevisning={!behandlingErRedigerbar}
                        />
                        <LandFelt
                            personopplysninger={personopplysninger}
                            erLesevisning={!behandlingErRedigerbar}
                        />
                        {erEøsLandkode(landkode) && (
                            <>
                                <NavnFelt erLesevisning={!behandlingErRedigerbar} />
                                <Adresselinje1Felt erLesevisning={!behandlingErRedigerbar} />
                                <Adresselinje2Felt erLesevisning={!behandlingErRedigerbar} />
                                {!erUtenlandskEøsLandkode(landkode) && (
                                    <>
                                        <PostnummerFelt erLesevisning={!behandlingErRedigerbar} />
                                        <PoststedFelt erLesevisning={!behandlingErRedigerbar} />
                                    </>
                                )}
                            </>
                        )}
                    </Fieldset>
                    {onSubmitServerError && (
                        <Alert
                            variant={'error'}
                            closeButton={true}
                            onClose={() => clearErrors(CustomFormErrors.onSubmitServerError.id)}
                        >
                            {onSubmitServerError}
                        </Alert>
                    )}
                    <HStack gap={'4'}>
                        {behandlingErRedigerbar && (
                            <Button variant={'primary'} type={'submit'} loading={isSubmitting}>
                                Legg til brevmottaker
                            </Button>
                        )}
                        {behandlingErRedigerbar && brevmottakere.length > 0 && !isSubmitting && (
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
