import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { LandFelt } from './felt/LandFelt';
import { MottakerFelt } from './felt/MottakerFelt';
import { Knapper } from './felt/Knapper';
import { FormDebugger } from './FormDebugger';
import { NavnFelt } from './felt/NavnFelt';
import { AdresselinjeFelt } from './felt/AdresselinjeFelt';
import { PostnummerFelt } from './felt/PostnummerFelt';
import { PoststedFelt } from './felt/PoststedFelt';
import { Alert, Heading, VStack } from '@navikt/ds-react';
import { EøsLandkode } from '../../../../../../Felles/Landvelger/landkode';
import { IPersonopplysninger } from '../../../../../../App/typer/personopplysninger';
import { BrevmottakerFeltnavn } from './felt/felttyper';
import { Brevmottaker, OpprettBrevmottakerDto } from '../../brevmottaker';
import styled from 'styled-components';
import { Mottakertype } from '../../mottakertype';

const StyledHeading = styled(Heading)`
    margin: 1rem 0 0.75rem;
`;

type FormValues = {
    [BrevmottakerFeltnavn.MOTTAKERTYPE]: Mottakertype | '';
    [BrevmottakerFeltnavn.LANDKODE]: EøsLandkode | '';
    [BrevmottakerFeltnavn.NAVN]: string;
    [BrevmottakerFeltnavn.ADRESSELINJE1]: string;
    [BrevmottakerFeltnavn.ADRESSELINJE2]: string;
    [BrevmottakerFeltnavn.POSTNUMMER]: string;
    [BrevmottakerFeltnavn.POSTSTED]: string;
};

type Props = {
    behandlingId: string;
    personopplysninger: IPersonopplysninger;
    brevmottakere: Brevmottaker[];
    erLesevisning: boolean; // TODO : Flytt til context?
    lukkModal: () => void;
    opprettBrevmottaker: (brevmottaker: OpprettBrevmottakerDto) => void;
};

export function BrevmottakerForm({
    personopplysninger,
    brevmottakere,
    erLesevisning,
    lukkModal,
    opprettBrevmottaker,
}: Props) {
    const onSubmit: SubmitHandler<FormValues> = (data) => {
        const { mottakertype, navn, landkode, adresselinje1, adresselinje2, postnummer, poststed } =
            data;
        const erUtenlandskLandkode = landkode !== EøsLandkode.NO;
        if (mottakertype === '') {
            throw Error('Mottakertype er påkrevd.');
        }
        opprettBrevmottaker({
            mottakertype: mottakertype,
            navn: navn,
            landkode: landkode,
            adresselinje1: adresselinje1,
            adresselinje2: adresselinje2,
            postnummer: erUtenlandskLandkode ? null : postnummer,
            poststed: erUtenlandskLandkode ? null : poststed,
        });
    };

    const form = useForm<FormValues>({
        mode: 'all',
        defaultValues: {
            [BrevmottakerFeltnavn.MOTTAKERTYPE]: '',
            [BrevmottakerFeltnavn.LANDKODE]: EøsLandkode.NO,
            [BrevmottakerFeltnavn.NAVN]: '',
            [BrevmottakerFeltnavn.ADRESSELINJE1]: '',
            [BrevmottakerFeltnavn.ADRESSELINJE2]: '',
            [BrevmottakerFeltnavn.POSTNUMMER]: '',
            [BrevmottakerFeltnavn.POSTSTED]: '',
        },
    });

    const { handleSubmit, getValues } = form;

    const landkode = getValues(BrevmottakerFeltnavn.LANDKODE);
    const erLandValgt = landkode !== '';
    const erUtenlandskAdresseValgt = erLandValgt && landkode !== EøsLandkode.NO;

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack gap={'4'}>
                    <StyledHeading size="medium">Ny mottaker</StyledHeading>
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
                    <Knapper erLesevisning={erLesevisning} vedAvbrytKlikk={lukkModal} />
                    <FormDebugger />
                </VStack>
            </form>
        </FormProvider>
    );
}
